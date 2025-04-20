import { differenceBy, filter, find, uniqBy } from "lodash";
import type {
  FieldArray,
  FieldNamesMarkedBoolean,
  FieldValues,
} from "react-hook-form";
import type { SalaryComponentListType } from "../../RangeBasedSalaryStructure/Add/SalaryRangeRightModule/SalaryStructureComponentList/Hooks/useGetSalaryComponentList";
import type { CustomSalaryComponentAllocationsType } from "../Add/AddCustomBasedSalaryStructure";
import { customCalculateDependedPercentage } from "../utils/customCalculateDependedPercentage";

type CustomSalaryComponentAllocation =
  CustomSalaryComponentAllocationsType["salary_component_allocations"];

type EditCustomSalaryStructureArgs = {
  formValues: Omit<CustomSalaryComponentAllocationsType, "selectedRows">;
  defaultCustomSalaryAllocations: CustomSalaryComponentAllocation;
  dirtyFields: FieldNamesMarkedBoolean<CustomSalaryComponentAllocationsType>;
};

type AddCustomSalaryStructureArgs = {
  earningComponentList: SalaryComponentListType[];
  savedSalaryComponent: string[];
  defaultCustomSalaryAllocationsValues: CustomSalaryComponentAllocation;
  componentCodes: string[];
};

type SortSalaryComponentsByOrderArgs = {
  earningComponentListOrder: string[];
  components: CustomSalaryComponentAllocation;
};

type GetSelectedComponentAllocationsArgs = {
  selectedComponents: SalaryComponentListType[];
};

type GetFilterSalaryComponentAllocationsArgs<T extends FieldValues[]> = {
  selectedSalaryComponentAllocations: T;
  savedSalaryComponent: string[];
};

type GetIsDependencySelectedArgs<T> = {
  allocations: T;
};

export const getSelectedComponentAllocations = <T extends FieldArray>({
  selectedComponents,
}: GetSelectedComponentAllocationsArgs): T => {
  return selectedComponents.map((selectedComponent) => {
    return {
      action: "add",
      calculation_type: "fixed",
      depends_on_salary_component_id: "",
      depends_on_salary_component_name: null,
      fixed_amount: null,
      id: null,
      percentage_value: null,
      salary_component_code: selectedComponent.earning_component_code,
      salary_component_id: selectedComponent.id,
      salary_component_name: selectedComponent.earning_component_name,
    };
  }) as T;
};

export const getFilterSalaryComponentAllocations = <T extends FieldValues[]>({
  selectedSalaryComponentAllocations,
  savedSalaryComponent,
}: GetFilterSalaryComponentAllocationsArgs<T>): T => {
  return selectedSalaryComponentAllocations.filter(
    (filterSalaryComponentAllocation) => {
      return !savedSalaryComponent.includes(
        filterSalaryComponentAllocation.salary_component_code
      );
    }
  ) as T;
};

export const addCustomSalaryStructure = ({
  earningComponentList,
  savedSalaryComponent,
  defaultCustomSalaryAllocationsValues,
  componentCodes,
}: AddCustomSalaryStructureArgs) => {
  const selectedComponents = earningComponentList.filter(
    (selectedComponent) => {
      return componentCodes.includes(selectedComponent.earning_component_code);
    }
  );

  const selectedSalaryComponentAllocations =
    getSelectedComponentAllocations<CustomSalaryComponentAllocation>({
      selectedComponents,
    });

  const filterSalaryComponentAllocations =
    getFilterSalaryComponentAllocations<CustomSalaryComponentAllocation>({
      selectedSalaryComponentAllocations,
      savedSalaryComponent,
    });

  const allSalaryComponentAllocations = [
    ...(defaultCustomSalaryAllocationsValues.length
      ? defaultCustomSalaryAllocationsValues
      : []),
    ...(filterSalaryComponentAllocations.length
      ? filterSalaryComponentAllocations
      : []),
  ];

  const filteredAllSalaryComponentAllocations = uniqBy(
    allSalaryComponentAllocations,
    "salary_component_code"
  );

  return filteredAllSalaryComponentAllocations;
};

const getChangedComponents = (
  original: CustomSalaryComponentAllocation,
  current: CustomSalaryComponentAllocation
) => {
  if (!Array.isArray(original) || !Array.isArray(current)) {
    return;
  }

  return filter(original).map((originalComponent) => {
    const currentComponent = find(current, { id: originalComponent.id });

    if (!currentComponent) {
      return null;
    }

    const hasChanged =
      originalComponent.calculation_type !==
        currentComponent.calculation_type ||
      originalComponent.percentage_value !==
        currentComponent.percentage_value ||
      originalComponent.fixed_amount !== currentComponent.fixed_amount ||
      originalComponent.depends_on_salary_component_id !==
        currentComponent.depends_on_salary_component_id;

    return hasChanged ? { ...currentComponent, action: "update" } : null;
  });
};

const getDeletedComponents = (
  original: CustomSalaryComponentAllocation,
  current: CustomSalaryComponentAllocation
) => {
  const deleted = differenceBy(original, current, "id");

  return deleted.map((component) => ({
    ...component,
    id: component.id,
    salary_component_id: component.salary_component_id,
    calculation_type: component.calculation_type,
    action: "delete",
  }));
};

const getNewComponents = (current: CustomSalaryComponentAllocation) => {
  return current
    .filter((component) => !component.id)
    .map((component) => ({
      ...component,
      action: "add",
    }));
};

export const editCustomSalaryStructure = ({
  defaultCustomSalaryAllocations,
  formValues,
  dirtyFields,
}: EditCustomSalaryStructureArgs) => {
  const { salary_component_allocations: currentAllocations } = formValues;

  const { customDependedPercentage } = customCalculateDependedPercentage({
    payload: { salary_component_allocations: currentAllocations },
  });

  if (!customDependedPercentage) {
    return;
  }

  const changedComponents = getChangedComponents(
    defaultCustomSalaryAllocations,
    currentAllocations
  );

  const deletedComponents = getDeletedComponents(
    defaultCustomSalaryAllocations,
    currentAllocations
  );

  const newComponents = getNewComponents(currentAllocations);

  const salary_component_allocations = [
    ...(Array.isArray(changedComponents) && changedComponents.length
      ? changedComponents
      : []),
    ...(newComponents.length ? newComponents : []),
    ...(Array.isArray(deletedComponents) && deletedComponents.length
      ? deletedComponents
      : []),
  ].filter((component) => component !== null);

  const modifiedFields = {
    ...(dirtyFields.salary_structure_name
      ? {
          salary_structure_name: formValues.salary_structure_name,
        }
      : {}),
    ...(dirtyFields.description
      ? {
          description: formValues.description,
        }
      : {}),
    ...(salary_component_allocations.length
      ? {
          salary_component_allocations,
        }
      : {}),
  };

  return modifiedFields;
};

export function sortSalaryComponentsByOrder({
  earningComponentListOrder,
  components,
}: SortSalaryComponentsByOrderArgs) {
  return components.sort((a, b) => {
    return (
      earningComponentListOrder.indexOf(a.salary_component_code) -
      earningComponentListOrder.indexOf(b.salary_component_code)
    );
  });
}

export const getIsDependencySelected = <T extends FieldValues[]>({
  allocations,
}: GetIsDependencySelectedArgs<T>) => {
  const dependsOnSalaryComponentIds = allocations.map((component) => {
    if (component.depends_on_salary_component_id !== "gross") {
      return component.depends_on_salary_component_id;
    }
  });

  return dependsOnSalaryComponentIds.some(Boolean);
};

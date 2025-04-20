import { toasts } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { sumBy } from "lodash";
import type { CustomSalaryComponentAllocationsType } from "../Add/AddCustomBasedSalaryStructure";
import { getIsDependencySelected } from "./helper";

type CustomCalculateDependedPercentageArgs = {
  payload: Omit<
    CustomSalaryComponentAllocationsType,
    "salary_structure_name" | "salary_interval"
  >;
};

export function customCalculateDependedPercentage({
  payload,
}: CustomCalculateDependedPercentageArgs) {
  const customDependedPercentage = true;

  const allocations = payload.salary_component_allocations;

  const isDependencySelected = getIsDependencySelected({
    allocations: payload.salary_component_allocations,
  });

  const adjustmentCount = allocations.filter(
    (component) => component.calculation_type === "adjustment"
  ).length;

  const isOnlyOneAdjustmentSelected = adjustmentCount === 1;

  const hasPercentageCalculation = allocations.some(
    (component) => component.calculation_type === "percentage"
  );

  const filteredPercentageValues = allocations.filter(
    (component) =>
      component.calculation_type === "percentage" &&
      component.percentage_value !== null
  );

  const totalPercentage = !isDependencySelected
    ? sumBy(
        filteredPercentageValues,
        (component) => component.percentage_value ?? 0
      )
    : 0;

  if (
    hasPercentageCalculation &&
    !isOnlyOneAdjustmentSelected &&
    !isDependencySelected &&
    totalPercentage !== 100
  ) {
    toasts.error({
      title: t("common.percentageNotMatched.message"),
    });

    return { customDependedPercentage: false };
  }

  if (!isOnlyOneAdjustmentSelected && isDependencySelected) {
    toasts.error({
      title: t("common.dependentSalaryComponentNotSelected.message"),
    });

    return { customDependedPercentage: false };
  }

  if (isOnlyOneAdjustmentSelected && !isDependencySelected) {
    toasts.error({
      title: t("common.invalidAdjustmentSelection.message"),
    });

    return { customDependedPercentage: false };
  }

  return { customDependedPercentage };
}

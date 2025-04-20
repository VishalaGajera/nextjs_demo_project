import { t } from "i18next";
import { getIsDependencySelected } from "../../../../CustomBasedSalaryStructure/utils/helper";
import { type SalaryComponentAllocationsType } from "../SalaryStructureRightModule";

export function calculateDependedPercentage({
  payLoad,
  totalValue,
  isOnlyOneAdjustmentSelected,
}: {
  payLoad: Omit<SalaryComponentAllocationsType, "selectedRows">;
  totalValue: number;
  isOnlyOneAdjustmentSelected: boolean;
}) {
  let grossValue = totalValue;

  const calculatedValues: Record<string, number> = {};

  let totalSumOfAmt = 0;

  let totalSumOfPr = 0;

  const isDependencySelected = getIsDependencySelected({
    allocations: payLoad.salary_component_allocations,
  });

  const getErrorMessage = () => {
    if (!isDependencySelected && isOnlyOneAdjustmentSelected) {
      return "common.invalidAdjustmentSelection.message";
    }

    if (isDependencySelected && !isOnlyOneAdjustmentSelected) {
      return "common.dependentSalaryComponentNotSelected.message";
    }

    if (isOnlyOneAdjustmentSelected) {
      return "common.invalidAdjustmentCalculation";
    }

    return "common.doesNotMatchedWithSalaryRange.message";
  };

  const isAllPercentage = payLoad.salary_component_allocations.every(
    (component) => component.calculation_type === "percentage"
  );

  payLoad.salary_component_allocations.forEach((component) => {
    if (
      component.calculation_type === "fixed" &&
      component?.salary_component_id &&
      component?.fixed_amount
    ) {
      calculatedValues[component.salary_component_id] = component.fixed_amount;
      totalSumOfAmt += component.fixed_amount;
    }
  });

  if (totalSumOfAmt !== 0 && !isOnlyOneAdjustmentSelected) {
    grossValue = grossValue - totalSumOfAmt;
  }

  payLoad.salary_component_allocations.forEach((component) => {
    if (component?.calculation_type === "percentage") {
      let baseValue: number | null = grossValue ?? null;

      if (
        (component?.depends_on_salary_component_id && !isAllPercentage) ||
        (component?.depends_on_salary_component_id && isAllPercentage)
      ) {
        baseValue =
          component.depends_on_salary_component_id === "gross"
            ? grossValue
            : (calculatedValues[component.depends_on_salary_component_id] ??
              null);
      }

      if (
        baseValue != null &&
        component?.percentage_value &&
        component?.salary_component_id
      ) {
        const calculatedValue = (baseValue * component.percentage_value) / 100;

        calculatedValues[component.salary_component_id] = calculatedValue;
        totalSumOfPr += calculatedValue;
      }
    }
  });

  return {
    calculatedValues,
    totalSum: totalSumOfPr + totalSumOfAmt,
    errorMessage: t(getErrorMessage()),
    isDependencySelected,
  };
}

import type { SalaryRangeDetails } from "../Hooks/useGetSalaryRangesDetails";

type CalculateSalaryBifurcationProps = {
  salary: number;
  salaryComponents: SalaryRangeDetails[];
  isOnlyOneAdjustmentSelected: boolean;
};

export const calculateSalaryBifurcation = ({
  salary,
  salaryComponents,
  isOnlyOneAdjustmentSelected,
}: CalculateSalaryBifurcationProps) => {
  let grossValue = salary;

  const filterToPositiveNumber = (value: number) => {
    return value > 0 ? value : 0;
  };

  const calculatedValues: Record<string, number> = {};

  let totalSumOfAmt = 0;

  let totalSumOfPr = 0;

  const isAllPercentage = salaryComponents.every(
    (component) => component.calculation_type === "percentage"
  );

  salaryComponents.forEach((component) => {
    if (
      component.calculation_type === "fixed" &&
      component.salary_component_id &&
      component.fixed_amount
    ) {
      calculatedValues[component.salary_component_id] = component.fixed_amount;
      totalSumOfAmt += component.fixed_amount;
    }
  });

  if (totalSumOfAmt !== 0 && !isOnlyOneAdjustmentSelected) {
    grossValue = grossValue - totalSumOfAmt;
  }

  salaryComponents.forEach((component) => {
    if (component.calculation_type === "percentage") {
      let baseValue = grossValue;

      if (
        (component.depends_on_salary_component_id && !isAllPercentage) ||
        (component.depends_on_salary_component_id && isAllPercentage)
      ) {
        baseValue =
          component.depends_on_salary_component_id === "gross"
            ? grossValue
            : (calculatedValues[component.depends_on_salary_component_id] ?? 0);
      }

      if (
        baseValue &&
        component.percentage_value &&
        component.salary_component_id
      ) {
        const calculatedValue = (baseValue * component.percentage_value) / 100;

        calculatedValues[component.salary_component_id] = calculatedValue;
        totalSumOfPr += calculatedValue;
      }
    }
  });

  salaryComponents.forEach((component) => {
    if (component.calculation_type === "adjustment") {
      const adjustment = salary - (totalSumOfAmt + totalSumOfPr);

      calculatedValues[component.salary_component_id] =
        adjustment > 0 ? adjustment : 0;
    }
  });

  return salaryComponents.map((component) => ({
    salary_structure_component_allocation_id: component.id,
    salary_component_value: parseFloat(
      filterToPositiveNumber(
        calculatedValues[component.salary_component_id] ?? 0
      ).toFixed(2)
    ),
    salary_component_name: component.salary_component.component_name,
  }));
};

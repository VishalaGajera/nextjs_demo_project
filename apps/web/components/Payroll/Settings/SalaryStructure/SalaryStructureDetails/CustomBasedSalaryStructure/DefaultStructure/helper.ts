import type { DefaultCustomSalaryComponentAllocationsType } from "./DefaultCustomBasedSalaryStructure";

type GetDefaultSortedSalaryComponentAllocationsArgs = {
  salaryComponentAllocations: DefaultCustomSalaryComponentAllocationsType["salary_component_allocations"];
  earningComponentDefaultOrder: string[];
};

export const getDefaultSortedSalaryComponentAllocations = ({
  earningComponentDefaultOrder,
  salaryComponentAllocations,
}: GetDefaultSortedSalaryComponentAllocationsArgs) => {
  return salaryComponentAllocations.sort(
    (a, b) =>
      earningComponentDefaultOrder.indexOf(a.salary_component_code) -
      earningComponentDefaultOrder.indexOf(b.salary_component_code)
  );
};

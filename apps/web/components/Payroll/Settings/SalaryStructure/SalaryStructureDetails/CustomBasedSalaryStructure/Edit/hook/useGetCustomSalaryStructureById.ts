import { useQuery } from "@tanstack/react-query";
import { SALARY_STRUCTURE_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/salary-structure/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { salaryStructureKeys } from "../../../../../../../../queryKeysFactories/SalaryStructure";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";

export type SalaryComponent = {
  component_name: string;
  component_code: string;
  is_taxable: boolean;
  recurring: boolean;
};

export type CalculationType = "fixed" | "percentage" | "adjustment";

export type SalaryComponentAllocation = {
  id: string;
  calculation_type: CalculationType;
  fixed_amount: number | null;
  percentage_value: number | null;
  depends_on_salary_component_id: string | null;
  depends_on_salary_component: SalaryComponent | null;
  salary_component_id: string;
  salary_component: SalaryComponent;
};

type CustomSalaryStructureType = {
  id: string;
  salary_structure_name: string;
  description: string;
  salary_component_allocations: SalaryComponentAllocation[];
};

export type UseGetCustomSalaryStructureByIdArgs = {
  ssId: string;
  csId: string;
};

export function useGetCustomSalaryStructureById({
  ssId,
  csId,
}: UseGetCustomSalaryStructureByIdArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useQuery({
    queryKey: salaryStructureKeys.getCustomSalaryById(ssId, csId),
    queryFn: async () => {
      const { data } = await axiosPrivate.get<
        ApiSuccessResponse<CustomSalaryStructureType>
      >(SALARY_STRUCTURE_ROUTES.getCustomSalaryStructureById(ssId, csId));

      return data.data;
    },
    enabled: !!ssId && !!csId,
  });
}

import { useQuery } from "@tanstack/react-query";
import { SALARY_STRUCTURE_ROUTES } from "../../../../../../../../../../constants/routes/payroll/settings/salary-structure/routes";
import { useAxiosPrivate } from "../../../../../../../../../../hooks/useAxiosPrivate";
import { salaryStructureKeys } from "../../../../../../../../../../queryKeysFactories/SalaryStructure";
import type { ApiSuccessResponse } from "../../../../../../../../../../types/apiResponse";
import type { SalaryRangeDetails } from "./useGetSalaryRangesDetails";

export type UseGetSalaryCustomDetailsArgs = {
  ssId: string;
  salaryStructureCustomId: string;
};

export type CustomSalaryDetails = {
  id: string;
  salary_structure_name: string;
  description: string;
  salary_component_allocations: SalaryRangeDetails[];
};

export function useGetSalaryCustomDetails({
  ssId,
  salaryStructureCustomId,
}: UseGetSalaryCustomDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useQuery({
    queryKey: salaryStructureKeys.getSalaryCustomDetails(
      ssId,
      salaryStructureCustomId
    ),
    queryFn: async () => {
      const { data } = await axiosPrivate.get<
        ApiSuccessResponse<CustomSalaryDetails>
      >(
        SALARY_STRUCTURE_ROUTES.getSalaryCustomDetails(
          ssId,
          salaryStructureCustomId
        )
      );

      return data;
    },
    enabled: !!ssId && !!salaryStructureCustomId,
  });
}

import { useQuery } from "@tanstack/react-query";
import { SALARY_STRUCTURE_ROUTES } from "../../../../../constants/routes/payroll/settings/salary-structure/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { salaryStructureKeys } from "../../../../../queryKeysFactories/SalaryStructure";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";
import type { OptionsType } from "../../../../../types/options";

type UseGetSalaryStructureNameOptionsArgs = {
  companyId: string;
};

export function useGetSalaryStructureNameOptions({
  companyId,
}: UseGetSalaryStructureNameOptionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchSalaryStructureNameOptions = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      SALARY_STRUCTURE_ROUTES.getSalaryStructureNameOptions(companyId)
    );

    return data.data;
  };

  return useQuery({
    queryKey: salaryStructureKeys.salaryStructureNameOptions(companyId),
    queryFn: fetchSalaryStructureNameOptions,
    enabled: !!companyId,
    initialData: [],
  });
}

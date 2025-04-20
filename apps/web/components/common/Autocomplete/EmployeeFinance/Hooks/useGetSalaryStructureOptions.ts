import { useQuery } from "@tanstack/react-query";
import { SALARY_STRUCTURE_ROUTES } from "../../../../../constants/routes/payroll/settings/salary-structure/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { salaryStructureKeys } from "../../../../../queryKeysFactories/SalaryStructure";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";
import type { OptionsType } from "../../../../../types/options";

type UseGetSalaryStructureOptionsArgs = {
  ssId: string;
};

export type SalaryStructureOption = {
  label: {
    from_range: number;
    to_range: number;
  };
  value: string;
};

export type SalaryStructureCustomOption = {
  label: string;
  value: string;
};

export type SalaryStructureCategory = {
  ranges: SalaryStructureOption[];
  custom: OptionsType[];
};

export type SalaryStructureOptions = {
  monthly: SalaryStructureCategory;
  daily: SalaryStructureCategory;
  hourly: SalaryStructureCategory;
  annually: SalaryStructureCategory;
};

export type SalaryStructureDataItem = {
  options: {
    label: string;
    value: SalaryStructureOptions;
  };
};

export function useGetSalaryStructureOptions({
  ssId,
}: UseGetSalaryStructureOptionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchSalaryStructureOptions = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<SalaryStructureDataItem>
    >(SALARY_STRUCTURE_ROUTES.getSalaryStructureOptions(ssId));

    return data.data;
  };

  return useQuery({
    queryKey: salaryStructureKeys.salaryStructureOptions(ssId),
    queryFn: fetchSalaryStructureOptions,
    enabled: !!ssId,
  });
}

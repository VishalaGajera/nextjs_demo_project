import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { SALARY_STRUCTURE_ROUTES } from "../../../../../../../../../constants/routes/payroll/settings/salary-structure/routes";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { salaryStructureKeys } from "../../../../../../../../../queryKeysFactories/SalaryStructure";
import type { QuickFilter } from "../../../../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../../../../types/apiResponse";

export type GetGratuityArgs = {
  body?:
    | Partial<IGetRowsParams>
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
  ssId: string;
  interval: string;
};

export type CustomSalaryStructureType = {
  id: string;
  salary_structure_name: string;
  description: string;
  action_by: string;
  action_at: string;
  full_count: string;
};

export function useCustomBasedSalaryStructureFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getCustomBasedSalaryStructureList = async ({
    body,
    interval,
    ssId,
  }: GetGratuityArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        customSalaryStructures: CustomSalaryStructureType[];
        totalCount: number;
      }>
    >(SALARY_STRUCTURE_ROUTES.post(ssId, interval), body);

    return data.data;
  };

  return { getCustomBasedSalaryStructureList };
}

export function useCustomBasedSalaryStructureList({
  body,
  ssId,
  interval,
}: GetGratuityArgs) {
  const { getCustomBasedSalaryStructureList } =
    useCustomBasedSalaryStructureFn();

  return useQuery({
    queryKey: salaryStructureKeys.customList(ssId, interval),
    queryFn: () => getCustomBasedSalaryStructureList({ body, interval, ssId }),
    initialData: { customSalaryStructures: [], totalCount: 0 },
    enabled: !!ssId && !!interval,
  });
}

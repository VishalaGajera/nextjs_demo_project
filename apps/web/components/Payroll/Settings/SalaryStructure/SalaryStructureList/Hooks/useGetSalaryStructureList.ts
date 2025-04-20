import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { SALARY_STRUCTURE_ROUTES } from "../../../../../../constants/routes/payroll/settings/salary-structure/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { salaryStructureKeys } from "../../../../../../queryKeysFactories/SalaryStructure";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

export type SalaryStructure = {
  id: string;
  salary_structure_name: string;
  salary_intervals: string[];
  structure_types: string[];
  description: string;
  company_name: string;
  action_by: string;
  action_at: string;
  full_count: string;
};

export type GetSalaryStructureArgs = {
  body?:
    | Partial<IGetRowsParams>
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useSalaryStructureQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getSalaryStructureList = async ({ body }: GetSalaryStructureArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        salaryStructures: SalaryStructure[];
        totalCount: number;
      }>
    >(SALARY_STRUCTURE_ROUTES.list, body);

    return data.data;
  };

  return { getSalaryStructureList };
}

export function useGetSalaryStructureList({ body }: GetSalaryStructureArgs) {
  const { getSalaryStructureList } = useSalaryStructureQueryFn();

  return useQuery({
    queryKey: salaryStructureKeys.listing(body),
    queryFn: () => getSalaryStructureList({ body }),
    initialData: { salaryStructures: [], totalCount: 0 },
  });
}

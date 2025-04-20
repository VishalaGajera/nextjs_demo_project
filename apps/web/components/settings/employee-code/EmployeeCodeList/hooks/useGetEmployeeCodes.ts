import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { employeeCodeKeys } from "../../../../../queryKeysFactories/employeeCode";
import type { QuickFilter } from "../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";
import { EMPLOYEE_CODE_ROUTES } from "../../../../../constants/routes/settings/employee-code/routes";

export type EmployeeCode = {
  id: string;
  employee_code_name: string;
  company_id: string;
  company_name: string;
  series_start: number;
  is_active: boolean;
  prefix: string;
  suffix: string;
  numeric_series: number;
  example: string;
  action_by: string;
  action_at: string;
};

type GetEmployeeCodesArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetEmployeeCodesQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getEmployeeCodes = async ({ body }: GetEmployeeCodesArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        employeeCodes: EmployeeCode[];
        totalCount: number;
      }>
    >(EMPLOYEE_CODE_ROUTES.listing, body);

    return data.data;
  };

  return { getEmployeeCodes };
}

export function useGetEmployeeCodes({ body }: GetEmployeeCodesArgs) {
  const { getEmployeeCodes } = useGetEmployeeCodesQueryFn();

  return useQuery({
    queryKey: employeeCodeKeys.listing(body),
    queryFn: () => getEmployeeCodes({ body }),
    initialData: { employeeCodes: [], totalCount: 0 },
  });
}

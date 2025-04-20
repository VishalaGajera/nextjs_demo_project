import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import type { FieldValues } from "react-hook-form";
import { EMPLOYEE_FINANCE_ROUTES } from "../../../../../constants/routes/payroll/employee-finance/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { salarySetupkeys } from "../../../../../queryKeysFactories/salarySetup";
import type { QuickFilter } from "../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";

export type EmployeeFinanceListType = {
  id: string;
  employee_code: string;
  punch_code: string;
  avatar: string;
  employee_name: string;
  department_name: string;
  sub_department_name: string;
  reporting_manager_avatar: string;
  designation_name: string;
  reporting_manager_name: string;
  salary: string | null;
  joining_date: string;
  full_count: string;
  company_id: string;
};

type GetEmployeeFinanceListArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
        externalFilter: FieldValues;
      }>;
};
export function useGetEmployeeFinanceListQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getEmployeeFinanceList = async ({
    body,
  }: GetEmployeeFinanceListArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        employeeFinances: EmployeeFinanceListType[];
        totalCount: number;
      }>
    >(EMPLOYEE_FINANCE_ROUTES.list, body);

    return data.data;
  };

  return { getEmployeeFinanceList };
}

export function useGetEmployeeFinanceList(
  bodyParams?: GetEmployeeFinanceListArgs
) {
  const { body = {} } = bodyParams ?? {};

  const { getEmployeeFinanceList } = useGetEmployeeFinanceListQueryFn();

  return useQuery({
    queryKey: salarySetupkeys.list(),
    queryFn: () => getEmployeeFinanceList({ body }),
    initialData: { employeeFinances: [], totalCount: 0 },
  });
}

import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { EMPLOYEE_ROUTES } from "../../../../../constants/routes/employee-management/employee/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { employeeKeys } from "../../../../../queryKeysFactories/employee";
import type { QuickFilter } from "../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";

export type Employee = {
  id: string;
  employee_code: string;
  punch_code: string;
  avatar: string;
  employee_name: string;
  joining_date: string;
  date_of_birth: string;
  email: string;
  mobile_no: string;
  alternate_mobile_no: string;
  company_name: string;
  business_unit_name: string;
  department_name: string;
  sub_department_name: string;
  designation_name: string;
  grade_name: string;
  work_type_name: string;
  skill_type_name: string;
  reporting_manager_name: string;
  pan_card_no: string;
  reporting_manager_avatar: string;
  aadhaar_card_no: string;
  action_by: string;
  action_at: string;
  business_unit_location_name: string;
};

type GetEmployeesArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
        externalFilter: {
          isDraft?: boolean;
        };
      }>;
};

export const RESPONSE_FIELD_EMPLOYEE_DIRECTORY_VIEW = [
  "id",
  "employee_code",
  "avatar",
  "employee_name",
  "joining_date",
  "designation_name",
  "department_name",
  "sub_department_name",
  "email",
  "mobile_no",
];

export function useGetEmployeesQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getEmployees = async ({ body }: GetEmployeesArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        employees: Employee[];
        totalCount: number;
      }>
    >(EMPLOYEE_ROUTES.listing, body);

    return data.data;
  };

  return { getEmployees };
}

export function useGetEmployees({ body }: GetEmployeesArgs) {
  const { getEmployees } = useGetEmployeesQueryFn();

  return useQuery({
    queryKey: employeeKeys.listing(body),
    queryFn: () => getEmployees({ body }),
    initialData: { employees: [], totalCount: 0 },
  });
}

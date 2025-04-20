import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { DEPARTMENT_ROUTES } from "../../../../../../constants/routes/settings/department/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { departmentKeys } from "../../../../../../queryKeysFactories/department";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

export type UnitHead = {
  avatar: string;
  employee_id: string;
  employee_name: string;
};

export type Department = {
  id: string;
  company_id: string;
  department_code: string;
  department_name: string;
  description: string;
  department_heads: UnitHead[];
  is_active: boolean;
  company_name: string;
  action_by: string;
  action_at: string;
  full_count: string;
};

type GetDepartmentsArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetDepartmentsQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getDepartments = async ({ body }: GetDepartmentsArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        departments: Department[];
        totalCount: number;
      }>
    >(DEPARTMENT_ROUTES.listing, body);

    return data.data;
  };

  return { getDepartments };
}

//NOTE: for future use
export function useGetDepartments({ body }: GetDepartmentsArgs) {
  const { getDepartments } = useGetDepartmentsQueryFn();

  return useQuery({
    queryKey: departmentKeys.listing(body),
    queryFn: () => getDepartments({ body }),
    initialData: { departments: [], totalCount: 0 },
  });
}

import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { subDepartmentKeys } from "../../../../../../queryKeysFactories/subDepartment";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import { SUB_DEPARTMENT_ROUTES } from "../../../../../../constants/routes/settings/sub-department/routes";
import type { UnitHead } from "../../../department/DepartmentList/hooks/useGetDepartments";

export type SubDepartment = {
  id: string;
  department_id: string;
  company_id: string;
  sub_department_code: string;
  sub_department_name: string;
  sub_department_heads: UnitHead[];
  description: string;
  is_active: boolean;
  department_name: string;
  company_name: string;
  action_by: string;
  action_at: string;
  full_count: string;
};

type GetSubDepartmentsArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetSubDepartmentsQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getSubDepartments = async ({ body }: GetSubDepartmentsArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        subDepartments: SubDepartment[];
        totalCount: number;
      }>
    >(SUB_DEPARTMENT_ROUTES.listing, body);

    return data.data;
  };

  return { getSubDepartments };
}

//NOTE: for future use
export function useGetSubDepartments({ body }: GetSubDepartmentsArgs) {
  const { getSubDepartments } = useGetSubDepartmentsQueryFn();

  return useQuery({
    queryKey: subDepartmentKeys.listing(body),
    queryFn: () => getSubDepartments({ body }),
    initialData: { subDepartments: [], totalCount: 0 },
  });
}

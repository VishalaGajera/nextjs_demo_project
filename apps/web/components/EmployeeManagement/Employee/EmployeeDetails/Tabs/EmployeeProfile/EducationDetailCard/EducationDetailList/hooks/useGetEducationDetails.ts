import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { employeeEducationKeys } from "../../../../../../../../../queryKeysFactories/employeeEducation";
import type { QuickFilter } from "../../../../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../../../../types/apiResponse";
import { EMPLOYEE_EDUCATION_DETAILS_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/education-detail/routes";

export type EducationDetails = {
  id: string;
  qualification: string;
  institute: string;
  from_date: string;
  to_date: string;
  percentage_or_grade: string;
  qualification_area: string;
  is_active: boolean;
  is_deleted: boolean;
  action_by: string;
  action_at: string;
};

type GetEmployeeEducationArgs = {
  body?:
    | Partial<IGetRowsParams>
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
  employeeId: string;
};

export function useGetEducationDetailsQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getEducationDetail = async ({
    body,
    employeeId,
  }: GetEmployeeEducationArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        employeeEducations: EducationDetails[];
        totalCount: number;
      }>
    >(EMPLOYEE_EDUCATION_DETAILS_ROUTES.listing(employeeId), body);

    return data.data;
  };

  return { getEducationDetail };
}

export function useGetEducationDetail({
  body,
  employeeId,
}: GetEmployeeEducationArgs) {
  const { getEducationDetail } = useGetEducationDetailsQueryFn();

  return useQuery({
    queryKey: employeeEducationKeys.listing(body),
    queryFn: () => getEducationDetail({ body, employeeId }),
    initialData: { employeeEducations: [], totalCount: 0 },
  });
}

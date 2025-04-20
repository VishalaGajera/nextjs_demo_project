import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { pastWorkEmploymentKeys } from "../../../../../../../../../queryKeysFactories/pastWorkEmployment";
import type { QuickFilter } from "../../../../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../../../../types/apiResponse";
import { EMPLOYEE_PAST_WORK_EMPLOYMENT_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/past-work-employment/routes";

export type PastWorkEmployment = {
  id: string;
  company_name: string;
  designation: string;
  from_date: string;
  to_date: string;
  address: string;
  leaving_reason: string;
  action_by: string;
  action_at: string;
};

type GetPastWorkEmploymentsArgs = {
  body?:
    | Partial<IGetRowsParams>
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
  employeeId: string;
};

export function useGetPastWorkEmploymentsQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getPastWorkEmployments = async ({
    body,
    employeeId,
  }: GetPastWorkEmploymentsArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        pastWorkEmployments: PastWorkEmployment[];
        totalCount: number;
      }>
    >(EMPLOYEE_PAST_WORK_EMPLOYMENT_ROUTES.listing(employeeId), body);

    return data.data;
  };

  return { getPastWorkEmployments };
}

export function useGetPastWorkEmployment({
  body,
  employeeId,
}: GetPastWorkEmploymentsArgs) {
  const { getPastWorkEmployments } = useGetPastWorkEmploymentsQueryFn();

  return useQuery({
    queryKey: pastWorkEmploymentKeys.listing(body),
    queryFn: () => getPastWorkEmployments({ body, employeeId }),
    initialData: { pastWorkEmployments: [], totalCount: 0 },
  });
}

import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import type { FieldValues } from "react-hook-form";
import { LEAVE_OVERVIEW_ROUTES } from "../../../../../../constants/routes/transactions/leave/leave-overview/route";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { leaveOverviewKey } from "../../../../../../queryKeysFactories/leaveOverview";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

export type LeaveEmployeeData = {
  id: string | null;
  employee_code: string | null;
  punch_code: string | null;
  employee_name: string | null;
  department_name: string | null;
  sub_department_name: string | null;
  designation_name: string | null;
  reporting_manager_name: string | null;
  avatar: string | null;
  leave_plan_name: string | null;
  reporting_manager_avatar: string;
};

type LeaveOverviewListBody = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
        externalFilter: FieldValues;
      }>;
};

export function useGetLeaveOverviewEmployeesQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getLeaveEmployee = async ({ body }: LeaveOverviewListBody) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        list: LeaveEmployeeData[];
        totalCount: number;
      }>
    >(LEAVE_OVERVIEW_ROUTES.listing(), body);

    return data.data;
  };

  return { getLeaveEmployee };
}

export function useGetLeaveOverviewEmployees({ body }: LeaveOverviewListBody) {
  const { getLeaveEmployee } = useGetLeaveOverviewEmployeesQueryFn();

  return useQuery({
    queryKey: leaveOverviewKey.listing(body),
    queryFn: () => getLeaveEmployee({ body }),
    initialData: { list: [], totalCount: 0 },
  });
}

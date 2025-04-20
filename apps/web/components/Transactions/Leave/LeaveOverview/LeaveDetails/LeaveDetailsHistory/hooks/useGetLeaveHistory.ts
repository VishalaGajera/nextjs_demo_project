import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { LEAVE_OVERVIEW_ROUTES } from "../../../../../../../constants/routes/transactions/leave/leave-overview/route";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { leaveOverviewKey } from "../../../../../../../queryKeysFactories/leaveOverview";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";
import type { LeaveHistoryType } from "./useGetLeaveHistoryColumns";

type useGetLeaveHistoryArgs = {
  employeeId: string;
  leaveTypeId: string;
  from_date: string;
  body?: IGetRowsParams;
};
export function useGetLeaveHistoryQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLeaveHistory = async ({
    employeeId,
    leaveTypeId,
    from_date,
  }: useGetLeaveHistoryArgs) => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<{
        data: LeaveHistoryType[];
        totalCount: number;
      }>
    >(LEAVE_OVERVIEW_ROUTES.getHistory(employeeId, leaveTypeId, from_date));

    return data.data;
  };

  return { fetchLeaveHistory };
}
export function useGetLeaveHistory({
  employeeId,
  leaveTypeId,
  from_date,
  body,
}: useGetLeaveHistoryArgs) {
  const { fetchLeaveHistory } = useGetLeaveHistoryQueryFn();

  return useQuery({
    queryKey: leaveOverviewKey.getHistory(employeeId, leaveTypeId, from_date),
    queryFn: () =>
      fetchLeaveHistory({ employeeId, leaveTypeId, from_date, body }),
    initialData: { data: [], totalCount: 0 },
  });
}

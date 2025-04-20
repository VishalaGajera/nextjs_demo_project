import { useQuery } from "@tanstack/react-query";
import { LEAVE_OVERVIEW_ROUTES } from "../../../../../../../../constants/routes/transactions/leave/leave-overview/route";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { leaveOverviewKey } from "../../../../../../../../queryKeysFactories/leaveOverview";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";

export type LeaveRequestData = {
  id: string | null;
  from_date: string | null;
  to_date: string | null;
  from_half: string | null;
  to_half: string | null;
  reason: string | null;
  status: string | null;
  leave_type: string | null;
  leave_type_name: string | null;
  applied_by: string | null;
  applied_at: string | null;
  last_action_remark: null;
  last_action_at: string | null;
  last_action_by: string | null;
  last_action_type: string | null;
  next_approvers: string[] | null;
  is_sandwich_leave: boolean;
  total_leaves: number | null;
};

type PendingLeaveRequestParams = {
  employeeId: string;
  fromDate: string;
};

export function useGetPendingLeaveRequests({
  employeeId,
  fromDate,
}: PendingLeaveRequestParams) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchPendingLeaveRequest = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<LeaveRequestData[]>
    >(LEAVE_OVERVIEW_ROUTES.pendingList(employeeId, fromDate));

    return data.data;
  };

  return useQuery({
    queryKey: leaveOverviewKey.getRequestList(employeeId, fromDate),
    queryFn: fetchPendingLeaveRequest,
    enabled: !!employeeId && !!fromDate,
  });
}

import { useQuery } from "@tanstack/react-query";
import { LEAVE_OVERVIEW_ROUTES } from "../../../../../../../../constants/routes/transactions/leave/leave-overview/route";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { leaveOverviewKey } from "../../../../../../../../queryKeysFactories/leaveOverview";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import type { LeaveRequest } from "../../../PendingLeaveRequests/Dialogs/hooks/useGetPendingLeaveRequest";

type useGetLeaveRequestHistoryArgs = {
  leaveRequestId: string;
  employeeId: string;
};

export function useGetLeaveRequestHistory({
  leaveRequestId,
  employeeId,
}: useGetLeaveRequestHistoryArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchPendingLeaveRequestHistory = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<LeaveRequest>>(
      LEAVE_OVERVIEW_ROUTES.getLeaveRequestHistoryUrl(
        employeeId,
        leaveRequestId
      )
    );

    return data;
  };

  return useQuery({
    queryKey: leaveOverviewKey.getLeaveRequestHistory(
      leaveRequestId,
      employeeId
    ),
    queryFn: fetchPendingLeaveRequestHistory,
    enabled: !!leaveRequestId && !!employeeId,
  });
}

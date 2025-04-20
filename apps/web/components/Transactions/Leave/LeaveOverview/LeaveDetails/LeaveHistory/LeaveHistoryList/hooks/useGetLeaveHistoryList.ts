import { useQuery } from "@tanstack/react-query";
import { LEAVE_HISTORY_ROUTES } from "../../../../../../../../constants/routes/transactions/leave/leave-overview/leave-history/route";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { leaveOverviewKey } from "../../../../../../../../queryKeysFactories/leaveOverview";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import type { LeaveRequestData } from "../../../PendingLeaveRequests/PendingLeaveRequestsList/hooks/useGetPendingLeaveRequests";

type LeaveHistoryListArgs = {
  employeeId: string;
  fromDate: string;
};

export function useGetLeaveHistoryList({
  employeeId,
  fromDate,
}: LeaveHistoryListArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLeaveHistoryList = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<LeaveRequestData[]>
    >(LEAVE_HISTORY_ROUTES.getLeaveHistory(employeeId, fromDate));

    return data.data;
  };

  return useQuery({
    queryKey: leaveOverviewKey.getRequestHistory(employeeId, fromDate),
    queryFn: fetchLeaveHistoryList,
    enabled: !!employeeId && !!fromDate,
    initialData: [],
  });
}

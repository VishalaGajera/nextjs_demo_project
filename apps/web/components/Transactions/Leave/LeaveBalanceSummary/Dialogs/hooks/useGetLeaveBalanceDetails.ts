import { useQuery } from "@tanstack/react-query";

import { LEAVE_BALANCE_SUMMARY_ROUTES } from "../../../../../../constants/routes/transactions/leave/leave-balance-summary/route";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { leaveBalanceSummaryKey } from "../../../../../../queryKeysFactories/leaveBalanceSummary";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { LeaveBalanceSummaryData } from "../../LeaveBalanceSummaryList/hooks/useGetLeaveBalanceSummaryList";

type UseGetLeaveBalanceSummaryDetailsArgs = {
  employeeId: string;
};

export function useGetLeaveBalanceSummaryDetails({
  employeeId,
}: UseGetLeaveBalanceSummaryDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLeaveBalanceSummary = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<LeaveBalanceSummaryData>>(
      LEAVE_BALANCE_SUMMARY_ROUTES.get(employeeId)
    );

    return data;
  };

  return useQuery({
    queryKey: leaveBalanceSummaryKey.get(employeeId),
    queryFn: fetchLeaveBalanceSummary,
    enabled: !!employeeId,
  });
}

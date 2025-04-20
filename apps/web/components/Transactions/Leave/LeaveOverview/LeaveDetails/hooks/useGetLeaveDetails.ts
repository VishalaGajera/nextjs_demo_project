import { useQuery } from "@tanstack/react-query";
import { LEAVE_OVERVIEW_ROUTES } from "../../../../../../constants/routes/transactions/leave/leave-overview/route";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { leaveOverviewKey } from "../../../../../../queryKeysFactories/leaveOverview";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

export type LeaveBalanceType = {
  id: string;
  leave_type_name: string;
  leave_type: string;
  leave_type_colour_code: string;
  available_balance: number;
  annual_leaves: number;
  used_leaves: number;
  accrual_leave: number;
  quota_type: string;
};

export type LeaveDetailsData = {
  leave_details: LeaveBalanceType[];
};

type UseGetLeaveDetailsArgs = {
  employeeId: string;
  fromDate: string;
};
export function useGetLeaveDetails({
  employeeId,
  fromDate,
}: UseGetLeaveDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEmployee = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<LeaveDetailsData>>(
      LEAVE_OVERVIEW_ROUTES.getLeaveBalances(employeeId, fromDate)
    );

    return data;
  };

  return useQuery({
    queryKey: leaveOverviewKey.getLeaveBalances(employeeId, fromDate),
    queryFn: fetchEmployee,
    enabled: !!employeeId && !!fromDate,
  });
}

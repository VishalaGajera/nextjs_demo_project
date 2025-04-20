import { useQuery } from "@tanstack/react-query";
import { LEAVE_OVERVIEW_ROUTES } from "../../../../../../../../constants/routes/transactions/leave/leave-overview/route";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { leaveOverviewKey } from "../../../../../../../../queryKeysFactories/leaveOverview";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import type { StatusType } from "../../../LeaveBalance/colorVariant";

type UseGetLeaveRequestArgs = {
  leaveRequestId: string;
  employeeId: string;
};

type Notifies = {
  id: string;
  employee_id: string;
  employee_name: string;
  avatar: string;
};

type Approver = {
  avatar: string;
  remark: string;
  status: StatusType;
  action_at: string;
  action_type: string;
  level_number: string;
  employee_name: string;
};

export type LeaveRequest = {
  id: string;
  employee_id: string;
  employee_name: string;
  avatar: string;
  company_id: string;
  leave_plan_id: string;
  leave_type_id: string;
  leave_type_name: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  from_half: string;
  to_half: string;
  reason: string;
  status: StatusType;
  attachments: string[];
  notifies: Notifies[];
  requested_by: string;
  requested_at: string;
  total_leaves: number;
  approver_details: Approver[];
};

export function useGetLeaveRequest({
  leaveRequestId,
  employeeId,
}: UseGetLeaveRequestArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchPendingLeaveRequest = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<LeaveRequest>>(
      LEAVE_OVERVIEW_ROUTES.getLeaveRequestUrl(employeeId, leaveRequestId)
    );

    return data;
  };

  return useQuery({
    queryKey: leaveOverviewKey.getLeaveRequest(leaveRequestId, employeeId),
    queryFn: fetchPendingLeaveRequest,
    enabled: !!leaveRequestId && !!employeeId,
  });
}

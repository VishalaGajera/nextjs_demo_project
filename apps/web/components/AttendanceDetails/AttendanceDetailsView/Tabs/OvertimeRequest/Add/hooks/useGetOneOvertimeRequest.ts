import { useQuery } from "@tanstack/react-query";
import { OVERTIME_REQUEST_ROUTES } from "../../../../../../../constants/routes/transactions/attendance/attendance-overview/overtime-request/route";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { overTimeRequestKeys } from "../../../../../../../queryKeysFactories/Transaction/Attendance/AttendanceOverview/OvertimeRequest";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";
import type { StatusType } from "../../../../../../Transactions/Leave/LeaveOverview/LeaveDetails/LeaveBalance/colorVariant";

type UseGetOneOvertimeRequestArgs = {
  employeeId: string;
  otRequestId: string;
};

export type OneOvertimeRequest = {
  id: string;
  employee_name: string;
  avatar: string;
  overtime_date: string;
  remark: string;
  status: StatusType;
  shift_type_id: string;
  shift_type_name: string;
  shift_start: string;
  shift_end: string;
  first_in_time: string;
  last_out_time: string;
  work_hours: string;
  in_time_overtime: string;
  out_time_overtime: string;
  work_in_time_overtime: string;
  work_out_time_overtime: string;
  day_type: string;
  slot_start: string;
  slot_end: string;
  shift_type: string;
  is_work_day_valid: boolean;
  approvals?: [
    {
      level: string;
      status: StatusType;
      approval_by_name: string;
      last_action_by: string;
      approval_avatar: string;
      last_action_at: string;
      approval_at: string;
      last_action_remark: string;
      remark: string;
    },
  ];
};

export function useGetOneOvertimeRequest({
  employeeId,
  otRequestId,
}: UseGetOneOvertimeRequestArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchOneOverTimeRequest = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<OneOvertimeRequest>>(
      OVERTIME_REQUEST_ROUTES.getOne(employeeId, otRequestId)
    );

    return data;
  };

  return useQuery({
    queryKey: overTimeRequestKeys.getOne(employeeId),
    queryFn: fetchOneOverTimeRequest,
    enabled: !!employeeId && !!otRequestId,
  });
}

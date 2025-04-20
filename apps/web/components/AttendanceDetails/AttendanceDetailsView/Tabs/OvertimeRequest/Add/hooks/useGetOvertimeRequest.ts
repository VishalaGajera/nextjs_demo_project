import { useQuery } from "@tanstack/react-query";
import { OVERTIME_REQUEST_ROUTES } from "../../../../../../../constants/routes/transactions/attendance/attendance-overview/overtime-request/route";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { overTimeRequestKeys } from "../../../../../../../queryKeysFactories/Transaction/Attendance/AttendanceOverview/OvertimeRequest";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";

type UseGetOvertimeRequestArgs = {
  employeeId: string;
  selectDate: string;
  isEnabled?: boolean;
};

export type OvertimeRequest = {
  id: string;
  employee_name: string;
  avatar: string;
  shift_type_id: string;
  shift_type_name: string;
  shift_start: string;
  shift_end: string;
  first_in_time: string;
  in_time_overtime: string;
  out_time_overtime: string;
  overtime_date: string;
  remark: string;
  last_out_time: string;
  work_hours: string;
  work_overtime_hours?: string;
  day_type: string;
  work_in_time_overtime: string;
  work_out_time_overtime: string;
  slot_start: string;
  slot_end: string;
  shift_type: string;
  is_work_day_valid: boolean;
};

export function useGetOvertimeRequest({
  employeeId,
  selectDate,
  isEnabled = true,
}: UseGetOvertimeRequestArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchOverTimeRequest = async () => {
    const response = await axiosPrivate.get<
      ApiSuccessResponse<OvertimeRequest>
    >(OVERTIME_REQUEST_ROUTES.get(employeeId, selectDate));

    return response.data.data;
  };

  return useQuery<OvertimeRequest, ApiErrorResponse>({
    queryKey: overTimeRequestKeys.get(employeeId, selectDate),
    queryFn: fetchOverTimeRequest,
    enabled: !!employeeId && !!selectDate && !!isEnabled,
  });
}

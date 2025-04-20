import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { OVERTIME_REQUEST_ROUTES } from "../../../../../../../constants/routes/transactions/attendance/attendance-overview/overtime-request/route";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { overTimeRequestKeys } from "../../../../../../../queryKeysFactories/Transaction/Attendance/AttendanceOverview/OvertimeRequest";
import type { QuickFilter } from "../../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";

export type OvertimeRequest = {
  id: string;
  overtime_date: string;
  requested_by: string;
  requested_date: string;
  finalOvertimeHours: string;
  in_time_overtime: string;
  out_time_overtime: string;
  remark: string;
  status: string;
  approval_by: string;
  approval_at: string;
  request_overtime_work_hours: string;
  final_overtime_work_hours: string;
  next_approver: string[];
  last_action_by: string;
  last_action_at: string;
  last_action_type: string;
  action_type: string;
};

type GetOverTimeRequestListArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
  employeeId: string;
};

export function useGetOvertimeRequestListQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const OvertimeRequestListBody = async ({
    body,
    employeeId,
  }: GetOverTimeRequestListArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        overtimeRequests: OvertimeRequest[];
        totalCount: number;
      }>
    >(OVERTIME_REQUEST_ROUTES.listing(employeeId), body);

    return data.data;
  };

  return { OvertimeRequestListBody };
}

export function useGetOverTimeRequestList({
  body,
  employeeId,
}: GetOverTimeRequestListArgs) {
  const { OvertimeRequestListBody } = useGetOvertimeRequestListQueryFn();

  return useQuery({
    queryKey: overTimeRequestKeys.listing(body),
    queryFn: () => OvertimeRequestListBody({ body, employeeId }),
    initialData: { overtimeRequests: [], totalCount: 0 },
  });
}

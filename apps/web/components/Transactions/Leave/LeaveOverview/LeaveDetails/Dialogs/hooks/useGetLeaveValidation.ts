import { useQuery } from "@tanstack/react-query";
import { LEAVE_OVERVIEW_ROUTES } from "../../../../../../../constants/routes/transactions/leave/leave-overview/route";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { leaveOverviewKey } from "../../../../../../../queryKeysFactories/leaveOverview";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";
import type { ApplyLeaveFormFieldValues } from "../ApplyLeaveForm";

export type LeaveDates = {
  id: string;
  to_date: string;
  from_date: string;
};

export type AlertNotes = {
  type: string;
  message: string;
  data: string[];
};

export type TeamRequests = {
  id: string;
  gen_full_name: string;
  avatar: string | null;
  leave_dates: LeaveDates[];
};

export type LeaveValidationData = {
  totalCalendarLeaveDays: number;
  totalLeaveDays: number;
  totalWeeklyOffs: number;
  totalHolidays: number;
  attendancePresentOnDate: string[];
  teamRequests: TeamRequests[];
  alertNotes: AlertNotes[];
  validationErrors: string[];
};

type LeaveValidationBody = {
  employeeId: string;
  leaveRequestId?: string;
  body: Partial<ApplyLeaveFormFieldValues>;
  enabled: boolean;
};

export function useGetLeaveValidationQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getLeaveValidation = async ({
    employeeId,
    leaveRequestId,
    body,
  }: LeaveValidationBody) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<LeaveValidationData>
    >(LEAVE_OVERVIEW_ROUTES.validate(employeeId, leaveRequestId), body);

    return data.data;
  };

  return { getLeaveValidation };
}

export function useGetLeaveValidation({
  employeeId,
  leaveRequestId,
  body,
  enabled,
}: LeaveValidationBody) {
  const { getLeaveValidation } = useGetLeaveValidationQueryFn();

  return useQuery({
    queryKey: [leaveOverviewKey.validate(employeeId, leaveRequestId), body],
    queryFn: () =>
      getLeaveValidation({ employeeId, leaveRequestId, body, enabled }),
    enabled,
  });
}

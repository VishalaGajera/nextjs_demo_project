"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { LEAVE_OVERVIEW_ROUTES } from "../../../../../../../constants/routes/transactions/leave/leave-overview/route";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { leaveOverviewKey } from "../../../../../../../queryKeysFactories/leaveOverview";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import type { LeaveRequest } from "../../PendingLeaveRequests/Dialogs/hooks/useGetPendingLeaveRequest";
import type { ApplyLeaveFormFieldValues } from "../ApplyLeaveForm";

type ApplyLeaveApiSuccessResponse = ApiSuccessResponse<LeaveRequest>;

type UseApplyLeaveArgs = {
  options: UseMutationOptions<
    ApplyLeaveApiSuccessResponse,
    ApiErrorResponse<ApplyLeaveFormFieldValues>,
    Partial<ApplyLeaveFormFieldValues>
  >;
  employeeId: string;
};

export function useApplyLeave({ employeeId, options = {} }: UseApplyLeaveArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: leaveOverviewKey.add(employeeId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<ApplyLeaveApiSuccessResponse>(
        LEAVE_OVERVIEW_ROUTES.post(employeeId),
        formValues
      );

      return data;
    },
    ...options,
  });
}

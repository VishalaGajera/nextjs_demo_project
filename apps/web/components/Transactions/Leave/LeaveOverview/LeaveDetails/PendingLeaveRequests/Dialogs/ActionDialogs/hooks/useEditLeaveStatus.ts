"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { LEAVE_OVERVIEW_ROUTES } from "../../../../../../../../../constants/routes/transactions/leave/leave-overview/route";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { leaveOverviewKey } from "../../../../../../../../../queryKeysFactories/leaveOverview";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../../types/apiResponse";
import type { LeaveRequest } from "../../hooks/useGetPendingLeaveRequest";
import type { LeaveStatusFormFieldValues } from "../LeaveStatusForm";

type EditLeaveStatusApiResponse = ApiSuccessResponse<LeaveRequest>;

type UseEditLeaveStatusArgs = {
  options: UseMutationOptions<
    EditLeaveStatusApiResponse,
    ApiErrorResponse<LeaveStatusFormFieldValues>,
    Partial<LeaveStatusFormFieldValues>
  >;
  employeeId: string;
  leaveRequestId: string;
  status?: "approved" | "rejected" | "cancelled";
};

export function useEditLeaveStatus({
  employeeId,
  leaveRequestId,
  status,
  options = {},
}: UseEditLeaveStatusArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: leaveOverviewKey.editStatus(
      employeeId,
      leaveRequestId,
      status
    ),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditLeaveStatusApiResponse>(
        LEAVE_OVERVIEW_ROUTES.changeStatus(employeeId, leaveRequestId, status),
        formValues
      );

      return data;
    },
    ...options,
  });
}

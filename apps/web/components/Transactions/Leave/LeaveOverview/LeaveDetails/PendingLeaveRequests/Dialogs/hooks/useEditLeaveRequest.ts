"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { LEAVE_OVERVIEW_ROUTES } from "../../../../../../../../constants/routes/transactions/leave/leave-overview/route";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { leaveOverviewKey } from "../../../../../../../../queryKeysFactories/leaveOverview";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import type { ApplyLeaveFormFieldValues } from "../../../Dialogs/ApplyLeaveForm";
import type { LeaveRequest } from "./useGetPendingLeaveRequest";

type EditLeaveRequestApiResponse = ApiSuccessResponse<LeaveRequest>;

type UseEditLeaveRequestArgs = {
  options: UseMutationOptions<
    EditLeaveRequestApiResponse,
    ApiErrorResponse<ApplyLeaveFormFieldValues>,
    Partial<ApplyLeaveFormFieldValues>
  >;
  employeeId: string;
  leaveRequestId: string;
};

export function useEditLeaveRequest({
  employeeId,
  leaveRequestId,
  options = {},
}: UseEditLeaveRequestArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: leaveOverviewKey.edit(employeeId, leaveRequestId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditLeaveRequestApiResponse>(
        LEAVE_OVERVIEW_ROUTES.patch(employeeId, leaveRequestId),
        formValues
      );

      return data;
    },
    ...options,
  });
}

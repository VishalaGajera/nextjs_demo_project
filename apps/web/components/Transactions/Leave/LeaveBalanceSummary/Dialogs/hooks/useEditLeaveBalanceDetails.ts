"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { LEAVE_BALANCE_SUMMARY_ROUTES } from "../../../../../../constants/routes/transactions/leave/leave-balance-summary/route";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { leaveBalanceSummaryKey } from "../../../../../../queryKeysFactories/leaveBalanceSummary";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { LeaveBalanceSummaryData } from "../../LeaveBalanceSummaryList/hooks/useGetLeaveBalanceSummaryList";
import type { LeaveBalanceFormFieldValues } from "../LeaveBalanceForm";

type EditLeaveBalanceDetailsApiResponse =
  ApiSuccessResponse<LeaveBalanceSummaryData>;

type UseEditLeaveBalanceDetailsArgs = {
  options: UseMutationOptions<
    EditLeaveBalanceDetailsApiResponse,
    ApiErrorResponse,
    Partial<LeaveBalanceFormFieldValues>
  >;
  employeeId: string;
};

export function useEditLeaveBalanceDetails({
  employeeId,
  options = {},
}: UseEditLeaveBalanceDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: leaveBalanceSummaryKey.edit(employeeId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditLeaveBalanceDetailsApiResponse>(
          LEAVE_BALANCE_SUMMARY_ROUTES.edit(employeeId),
          formValues
        );

      return data;
    },
    ...options,
  });
}

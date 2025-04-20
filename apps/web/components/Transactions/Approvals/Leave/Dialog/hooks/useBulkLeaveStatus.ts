import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { APPROVAL_LEAVE_BASE_URL } from "../../../../../../constants/routes/transactions/approvals/leave-requests/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { approvalLeaveKeys } from "../../../../../../queryKeysFactories/approvalLeave";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { LeaveType } from "../../LeaveList/hooks/useGetLeaveList";
import type { BulkLeaveFormValues } from "../BulkLeaveForm";

type BulkLeaveStatusApiSuccessResponse = ApiSuccessResponse<LeaveType>;

type UseBulkLeaveStatusArgs = {
  options: UseMutationOptions<
    BulkLeaveStatusApiSuccessResponse,
    ApiErrorResponse<BulkLeaveFormValues>,
    Partial<BulkLeaveFormValues>
  >;
  leaveRequestIds: string[];
};

export function useBulkLeaveStatus({
  leaveRequestIds,
  options = {},
}: UseBulkLeaveStatusArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: approvalLeaveKeys.approveBulkLeave(leaveRequestIds),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<BulkLeaveStatusApiSuccessResponse>(
          APPROVAL_LEAVE_BASE_URL,
          formValues
        );

      return data;
    },
    ...options,
  });
}

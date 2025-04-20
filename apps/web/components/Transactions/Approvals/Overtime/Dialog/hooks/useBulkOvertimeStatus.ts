import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { APPROVAL_OVERTIME_BASE_URL } from "../../../../../../constants/routes/transactions/approvals/overtime-requests/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { approvalOvertimeKeys } from "../../../../../../queryKeysFactories/approvalOvertime";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { OvertimeType } from "../../OvertimeList/hooks/useGetOvertimeList";
import type { BulkOvertimeFormValues } from "../BulkOvertimeForm";

type BulkOvertimeStatusApiSuccessResponse = ApiSuccessResponse<OvertimeType>;

type UseBulkOvertimeStatusArgs = {
  options: UseMutationOptions<
    BulkOvertimeStatusApiSuccessResponse,
    ApiErrorResponse<BulkOvertimeFormValues>,
    Partial<BulkOvertimeFormValues>
  >;
  overtimeRequestIds: string[];
};

export function useBulkOvertimeStatus({
  overtimeRequestIds,
  options = {},
}: UseBulkOvertimeStatusArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: approvalOvertimeKeys.approveBulkOvertime(overtimeRequestIds),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<BulkOvertimeStatusApiSuccessResponse>(
          APPROVAL_OVERTIME_BASE_URL,
          formValues
        );

      return data;
    },
    ...options,
  });
}

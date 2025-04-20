"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";

import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import type { SalaryComponent } from "../../../SalaryComponentForm";
import { REIMBURSEMENT_ROUTES } from "../../../../../../../constants/routes/payroll/settings/salary-components/reimbursement/routes";
import { reimbursementKeys } from "../../../../../../../queryKeysFactories/reimbursement";

type DeleteReimbursementApiResponse = ApiSuccessResponse<SalaryComponent>;

type UseDeleteReimbursementArgs = {
  options: UseMutationOptions<DeleteReimbursementApiResponse, ApiErrorResponse>;
  reimbursementId: string;
};

export function useDeleteReimbursement({
  reimbursementId,
  options = {},
}: UseDeleteReimbursementArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: reimbursementKeys.delete(reimbursementId),
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeleteReimbursementApiResponse>(
          REIMBURSEMENT_ROUTES.delete(reimbursementId)
        );

      return data;
    },
    ...options,
  });
}

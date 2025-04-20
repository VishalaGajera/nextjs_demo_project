"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { LOAN_ROUTES } from "../../../../../../constants/routes/payroll/payroll-transaction/loan/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { loanKeys } from "../../../../../../queryKeysFactories/loan";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { LoanListType } from "../../LoanList/hooks/useGetLoanList";

type DeleteLoanApiResponse = ApiSuccessResponse<LoanListType>;

type UseDeleteLoanArgs = {
  options: UseMutationOptions<DeleteLoanApiResponse, ApiErrorResponse>;
  loanId: string;
};

export function useDeleteLoan({ loanId, options = {} }: UseDeleteLoanArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: loanKeys.delete(loanId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteLoanApiResponse>(
        LOAN_ROUTES.delete(loanId)
      );

      return data;
    },
    ...options,
  });
}

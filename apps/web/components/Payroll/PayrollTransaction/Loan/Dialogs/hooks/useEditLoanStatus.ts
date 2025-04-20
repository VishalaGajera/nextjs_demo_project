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
import type {
  DecisionStatus,
  LoanStatusFormFieldValues,
} from "../LoanStatusForm";

type EditLoanStatusApiResponse = ApiSuccessResponse<LoanListType>;

type UseEditLoanStatusArgs = {
  options: UseMutationOptions<
    EditLoanStatusApiResponse,
    ApiErrorResponse<LoanStatusFormFieldValues>,
    Partial<LoanStatusFormFieldValues>
  >;
  loanId: string;
  status: DecisionStatus;
};

export function useEditLoanStatus({
  loanId,
  status,
  options = {},
}: UseEditLoanStatusArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: loanKeys.status(loanId, status),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditLoanStatusApiResponse>(
        LOAN_ROUTES.status(loanId, status),
        formValues
      );

      return data;
    },
    ...options,
  });
}

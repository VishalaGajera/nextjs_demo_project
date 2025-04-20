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
import type { LoanFormFieldValues } from "../../AddLoan/LoanForm";
import type { LoanListType } from "../../LoanList/hooks/useGetLoanList";

type EditLoanApiResponse = ApiSuccessResponse<LoanListType>;

type UseEditLoanArgs = {
  options: UseMutationOptions<
    EditLoanApiResponse,
    ApiErrorResponse<LoanFormFieldValues>,
    Partial<LoanFormFieldValues>
  >;
  loanId: string;
};

export function useEditLoan({ loanId, options = {} }: UseEditLoanArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: loanKeys.edit(loanId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditLoanApiResponse>(
        LOAN_ROUTES.patch(loanId),
        formValues
      );

      return data;
    },
    ...options,
  });
}

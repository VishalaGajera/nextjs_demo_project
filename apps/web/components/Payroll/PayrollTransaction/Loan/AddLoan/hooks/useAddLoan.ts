"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { LOAN_ROUTES } from "../../../../../../constants/routes/payroll/payroll-transaction/loan/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { loanKeys } from "../../../../../../queryKeysFactories/loan";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { LoanListType } from "../../LoanList/hooks/useGetLoanList";
import type { LoanFormFieldValues } from "../LoanForm";

type AddLoanApiSuccessResponse = ApiSuccessResponse<LoanListType>;

type UseAddLoanArgs = {
  options: UseMutationOptions<
    AddLoanApiSuccessResponse,
    ApiErrorResponse,
    Partial<LoanFormFieldValues>
  >;
};

export function useAddLoan({ options = {} }: UseAddLoanArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const currentDate = DateTime.now().toISODate();

  return useMutation({
    mutationKey: loanKeys.add(currentDate),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddLoanApiSuccessResponse>(
        LOAN_ROUTES.post(currentDate),
        formValues
      );

      return data;
    },
    ...options,
  });
}

"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { LOAN_POLICY_ROUTES } from "../../../../../../constants/routes/policy-configuration/loan/loan-policy/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { loanPolicyKeys } from "../../../../../../queryKeysFactories/loanPolicy";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { LoanPolicy } from "../../LoanPolicyList/hooks/useGetLoanPolicies";
import type { LoanPolicyPayload } from "../LoanPolicyForm";

type AddLoanPolicyApiSuccessResponse = ApiSuccessResponse<LoanPolicy>;

type UseAddLoanPolicyArgs = {
  options: UseMutationOptions<
    AddLoanPolicyApiSuccessResponse,
    ApiErrorResponse,
    Partial<LoanPolicyPayload>
  >;
};

export function useAddLoanPolicy({ options = {} }: UseAddLoanPolicyArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: loanPolicyKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddLoanPolicyApiSuccessResponse>(
        LOAN_POLICY_ROUTES.post,
        formValues
      );

      return data;
    },
    ...options,
  });
}

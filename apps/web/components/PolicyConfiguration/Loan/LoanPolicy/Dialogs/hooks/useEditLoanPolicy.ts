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

type EditLoanPolicyApiResponse = ApiSuccessResponse<LoanPolicy>;

type UseEditLoanPolicyArgs = {
  options: UseMutationOptions<
    EditLoanPolicyApiResponse,
    ApiErrorResponse,
    Partial<LoanPolicyPayload>
  >;
  policyId: string;
};

export function useEditLoanPolicy({
  policyId,
  options = {},
}: UseEditLoanPolicyArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: loanPolicyKeys.edit(policyId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditLoanPolicyApiResponse>(
        LOAN_POLICY_ROUTES.patch(policyId),
        formValues
      );

      return data;
    },
    ...options,
  });
}

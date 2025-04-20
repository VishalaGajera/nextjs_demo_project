import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { LOAN_POLICY_ROUTES } from "../../../../../../constants/routes/policy-configuration/loan/loan-policy/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { loanPolicyKeys } from "../../../../../../queryKeysFactories/loanPolicy";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { LoanPolicy } from "../../LoanPolicyList/hooks/useGetLoanPolicies";

type DeleteLoanPolicyApiResponse = ApiSuccessResponse<LoanPolicy>;

type UseDeleteLoanPolicyArgs = {
  options: UseMutationOptions<DeleteLoanPolicyApiResponse, ApiErrorResponse>;
  policyId: string;
};

export function useDeleteLoanPolicy({
  policyId,
  options = {},
}: UseDeleteLoanPolicyArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: loanPolicyKeys.delete(policyId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteLoanPolicyApiResponse>(
        LOAN_POLICY_ROUTES.delete(policyId)
      );

      return data;
    },
    ...options,
  });
}

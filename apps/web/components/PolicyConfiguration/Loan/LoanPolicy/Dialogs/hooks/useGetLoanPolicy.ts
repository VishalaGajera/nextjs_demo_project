import { useQuery } from "@tanstack/react-query";
import { LOAN_POLICY_ROUTES } from "../../../../../../constants/routes/policy-configuration/loan/loan-policy/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { loanPolicyKeys } from "../../../../../../queryKeysFactories/loanPolicy";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { LoanPolicyPayload } from "../LoanPolicyForm";

type UseGetLoanPolicyArgs = {
  policyId: string;
};

export function useGetLoanPolicy({ policyId }: UseGetLoanPolicyArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLoanPolicy = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<LoanPolicyPayload>
    >(LOAN_POLICY_ROUTES.get(policyId));

    return data.data;
  };

  return useQuery({
    queryKey: loanPolicyKeys.get(policyId),
    queryFn: fetchLoanPolicy,
    initialData: null,
  });
}

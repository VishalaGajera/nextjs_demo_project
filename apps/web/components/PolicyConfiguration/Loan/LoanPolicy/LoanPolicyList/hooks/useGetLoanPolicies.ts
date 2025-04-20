import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { LOAN_POLICY_ROUTES } from "../../../../../../constants/routes/policy-configuration/loan/loan-policy/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { loanPolicyKeys } from "../../../../../../queryKeysFactories/loanPolicy";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

export type LoanPolicy = {
  id: string;
  company_name: string;
  loan_policy_code: string;
  loan_policy_name: string;
  description: string;
  is_approval_required: boolean;
  action_by: string;
  action_at: string;
  full_count: string;
};

type LoanPoliciesArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetLoanPoliciesQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getLoanPolicies = async ({ body }: LoanPoliciesArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        loanPolicies: LoanPolicy[];
        totalCount: number;
      }>
    >(LOAN_POLICY_ROUTES.listing, body);

    return data.data;
  };

  return { getLoanPolicies };
}

export function useLoanPolicies({ body }: LoanPoliciesArgs) {
  const { getLoanPolicies } = useGetLoanPoliciesQueryFn();

  return useQuery({
    queryKey: loanPolicyKeys.listing(body),
    queryFn: () => getLoanPolicies({ body }),
    initialData: { loanPolicies: [], totalCount: 0 },
  });
}

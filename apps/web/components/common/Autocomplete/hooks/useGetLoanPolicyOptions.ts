import { useQuery } from "@tanstack/react-query";
import { LOAN_POLICY_ROUTES } from "../../../../constants/routes/policy-configuration/loan/loan-policy/routes";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { loanPolicyKeys } from "../../../../queryKeysFactories/loanPolicy";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";

type UseGetLoanPolicyOptionsArgs = {
  companyId: string;
};

export function useGetLoanPolicyOptions({
  companyId,
}: UseGetLoanPolicyOptionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLoanPolicyOptions = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      LOAN_POLICY_ROUTES.options(companyId)
    );

    return data.data;
  };

  return useQuery({
    queryKey: loanPolicyKeys.options(companyId),
    queryFn: fetchLoanPolicyOptions,
    enabled: !!companyId,
    initialData: [],
  });
}

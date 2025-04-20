import { useQuery } from "@tanstack/react-query";
import { penaltyRuleKeys } from "../../../../../../queryKeysFactories/penaltyRule";
import type { PenaltyRules } from "../../PenaltyRulesList/hooks/useGetPenaltyRules";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { PenaltyRulesFormFieldValues } from "../../AddPenaltyRules/PenaltyRulesForm";
import { PENALTY_RULE_ROUTES } from "../../../../../../constants/routes/policy-configuration/attendance/penalty-rule/routes";

type UseGetPenaltyRuleArgs = {
  penaltyRulesId: PenaltyRules["id"];
};

export function useGetPenaltyRule({ penaltyRulesId }: UseGetPenaltyRuleArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchPenaltyRule = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<PenaltyRulesFormFieldValues>>(
      PENALTY_RULE_ROUTES.get(penaltyRulesId)
    );

    return data;
  };

  return useQuery({
    queryKey: penaltyRuleKeys.get(penaltyRulesId),
    queryFn: fetchPenaltyRule,
    enabled: !!penaltyRulesId,
  });
}

"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { penaltyRuleKeys } from "../../../../../../queryKeysFactories/penaltyRule";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { PenaltyRules } from "../../PenaltyRulesList/hooks/useGetPenaltyRules";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { PENALTY_RULE_ROUTES } from "../../../../../../constants/routes/policy-configuration/attendance/penalty-rule/routes";

type DeletePenaltyRulesApiResponse = ApiSuccessResponse<PenaltyRules>;

type UseDeletePenaltyRulesArgs = {
  options: UseMutationOptions<DeletePenaltyRulesApiResponse, ApiErrorResponse>;
  penaltyRulesId: string;
};

export function useDeletePenaltyRules({
  penaltyRulesId,
  options = {},
}: UseDeletePenaltyRulesArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: penaltyRuleKeys.delete(penaltyRulesId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeletePenaltyRulesApiResponse>(
        PENALTY_RULE_ROUTES.delete(penaltyRulesId)
      );

      return data;
    },
    ...options,
  });
}

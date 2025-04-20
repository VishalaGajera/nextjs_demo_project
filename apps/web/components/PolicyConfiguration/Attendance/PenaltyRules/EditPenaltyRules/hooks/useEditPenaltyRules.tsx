"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { penaltyRuleKeys } from "../../../../../../queryKeysFactories/penaltyRule";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { PenaltyRules } from "../../PenaltyRulesList/hooks/useGetPenaltyRules";
import type { PenaltyRulesFormFieldValues } from "../../AddPenaltyRules/PenaltyRulesForm";
import { PENALTY_RULE_ROUTES } from "../../../../../../constants/routes/policy-configuration/attendance/penalty-rule/routes";

type EditPenaltyRulesApiResponse = ApiSuccessResponse<PenaltyRules>;

type UseEditPenaltyRulesArgs = {
  options: UseMutationOptions<
    EditPenaltyRulesApiResponse,
    ApiErrorResponse<PenaltyRulesFormFieldValues>,
    Partial<PenaltyRulesFormFieldValues>
  >;
  penaltyRulesId: string;
};

export function useEditPenaltyRules({
  penaltyRulesId,
  options = {},
}: UseEditPenaltyRulesArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: penaltyRuleKeys.edit(penaltyRulesId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditPenaltyRulesApiResponse>(
        PENALTY_RULE_ROUTES.get(penaltyRulesId),
        formValues
      );

      return data;
    },
    ...options,
  });
}

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
import type { PenaltyRulesFormFieldValues } from "../PenaltyRulesForm";
import { PENALTY_RULE_ROUTES } from "../../../../../../constants/routes/policy-configuration/attendance/penalty-rule/routes";

type AddPenaltyRulesApiSuccessResponse = ApiSuccessResponse<PenaltyRules>;

type UseAddPenaltyRulesArgs = {
  options: UseMutationOptions<
    AddPenaltyRulesApiSuccessResponse,
    ApiErrorResponse,
    Partial<PenaltyRulesFormFieldValues>
  >;
};

export function useAddPenaltyRules({ options = {} }: UseAddPenaltyRulesArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: penaltyRuleKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddPenaltyRulesApiSuccessResponse>(
          PENALTY_RULE_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}

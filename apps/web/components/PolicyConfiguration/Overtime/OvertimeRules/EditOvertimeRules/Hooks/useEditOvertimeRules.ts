"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { OVERTIME_RULE_ROUTES } from "../../../../../../constants/routes/policy-configuration/overtime/overtime-rule/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { overTimeKeys } from "../../../../../../queryKeysFactories/overTime";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { OvertimeRulesFormFieldValues } from "../../AddOvertimeRules/AddOvertimeRulesForm";
import type { OvertimesRulesResponse } from "./useGetOvertimeRules";
import type { SubmissionAndApprovalDetails } from "../../AddOvertimeRules/hooks/useAddOvertimeRules";

type EditOvertimeRulesApiResponse = ApiSuccessResponse<OvertimesRulesResponse>;

export type EditOvertimeRulesPayload = Omit<
  OvertimeRulesFormFieldValues,
  "submission_and_approval_details"
> & {
  submission_and_approval_details: SubmissionAndApprovalDetails;
};

type UseEditOvertimeRulesArgs = {
  options: UseMutationOptions<
    EditOvertimeRulesApiResponse,
    ApiErrorResponse<OvertimeRulesFormFieldValues>,
    Partial<EditOvertimeRulesPayload> | Partial<OvertimeRulesFormFieldValues>
  >;
  overTimeRulesId: string;
};

export function useEditOvertimeRules({
  overTimeRulesId,
  options = {},
}: UseEditOvertimeRulesArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: overTimeKeys.edit(overTimeRulesId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditOvertimeRulesApiResponse>(
        OVERTIME_RULE_ROUTES.patch(overTimeRulesId),
        formValues
      );

      return data;
    },
    ...options,
  });
}

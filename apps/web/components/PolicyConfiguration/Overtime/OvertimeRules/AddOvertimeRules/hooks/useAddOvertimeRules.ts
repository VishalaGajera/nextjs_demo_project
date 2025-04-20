"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { OVERTIME_RULE_ROUTES } from "../../../../../../constants/routes/policy-configuration/overtime/overtime-rule/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { overTimeKeys } from "../../../../../../queryKeysFactories/overTime";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { OvertimeRulesFormFieldValues } from "../AddOvertimeRulesForm";

type AddOvertimeRulesApiSuccessResponse = ApiSuccessResponse<{
  data: string;
  message: string;
}>;

export type Assignment = {
  id?: string | null;
  action?: string | null;
  employee_id?: string | null;
  overtime_approval_type?: string;
};

export type ApprovalWorkflow = {
  level: number;
  action?: string;
  id?: string;
  is_auto_approve_days_enabled: boolean;
  auto_approve_days?: number | null;
  assignments: Assignment[] | string[];
};

export type SubmissionAndApprovalDetails = Partial<{
  approval_workflow: ApprovalWorkflow[];
  is_comment_required: boolean;
  allow_past_dated_request: boolean;
  manager_can_submit: boolean;
  skip_approver_if_not_assigned: boolean;
  is_notice_period_days: boolean;
  notice_period_days?: number | null;
}>;

export type AddOvertimeRulesPayload = Omit<
  OvertimeRulesFormFieldValues,
  "submission_and_approval_details"
> & {
  submission_and_approval_details: SubmissionAndApprovalDetails;
};

type UseAddOvertimeRulesArgs = {
  options: UseMutationOptions<
    AddOvertimeRulesApiSuccessResponse,
    ApiErrorResponse<OvertimeRulesFormFieldValues>,
    Partial<AddOvertimeRulesPayload> | Partial<OvertimeRulesFormFieldValues>
  >;
};

export function useAddOvertimeRules({ options = {} }: UseAddOvertimeRulesArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: overTimeKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddOvertimeRulesApiSuccessResponse>(
          OVERTIME_RULE_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}

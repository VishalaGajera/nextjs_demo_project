import { useQuery } from "@tanstack/react-query";
import { OVERTIME_RULE_ROUTES } from "../../../../../../constants/routes/policy-configuration/overtime/overtime-rule/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { overTimeKeys } from "../../../../../../queryKeysFactories/overTime";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

type useGetOvertimeRulesArgs = {
  overTimeRulesId: string;
};

export type dayTypeSchema = {
  is_employee_paid_overtime_enabled: boolean;
  calculation_unit_type: "hours" | "day";
  hours_compensation: "all_hours" | "before_shift_start" | "after_shift_end";
  paid_overtime_criteria: [
    {
      overtime_start_minutes: number | null;
      overtime_end_minutes: number | null;
      id: string | null;
      overtime_rate_type_day: number | null;
    },
  ];
  minimum_in_time_overtime_duration_minutes?: number | null;
  minimum_out_time_overtime_duration_minutes?: number | null;
};

export type Assignment = {
  id?: string;
  employee_id: string;
  overtime_approval_type: string;
  action?: string | null;
};

export type ApprovalWorkflow = {
  level: number;
  id?: string;
  action?: string;
  is_auto_approve_days_enabled: boolean;
  auto_approve_days?: number | null;
  assignments: Assignment[];
};

export type SubmissionAndApprovalDetails = {
  approval_workflow: ApprovalWorkflow[];
  is_comment_required: boolean;
  allow_past_dated_request: boolean;
  manager_can_submit: boolean;
  skip_approver_if_not_assigned: boolean;
  is_notice_period_days: boolean;
  maximum_past_request_days?: number | null;
  notice_period_days?: number | null;
};

export type OvertimesRulesResponse = {
  company_id: string;
  overtime_rule_name: string;
  overtime_rule_code: string;
  working_day: dayTypeSchema;
  weekly_off_day: dayTypeSchema;
  holiday_day: dayTypeSchema;
  is_round_off: boolean;
  round_off_minutes?: number | null;
  round_off_to?: "round_off_nearest" | "round_down_to" | "round_up_to";
  submission_and_approval_type?:
    | "manual_approval"
    | "auto_calculate_approval"
    | "auto_calculate_no_approval";
  submission_and_approval_details: SubmissionAndApprovalDetails;
};

export function useGetOvertimeRules({
  overTimeRulesId,
}: useGetOvertimeRulesArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const getOvertimeRules = async ({
    overTimeRulesId,
  }: useGetOvertimeRulesArgs) => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<OvertimesRulesResponse>>(
      OVERTIME_RULE_ROUTES.get(overTimeRulesId)
    );

    return data;
  };

  return useQuery({
    queryKey: overTimeKeys.get(overTimeRulesId),
    queryFn: () => getOvertimeRules({ overTimeRulesId }),
    enabled: !!overTimeRulesId,
  });
}

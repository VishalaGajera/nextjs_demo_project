import { CheckBox, RadioGroupField, TextField } from "@codezee/sixtify-brahma";
import { Box, InputLabel, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { memo, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import {
  submissionType,
  type DeletedApprovalWorkflow,
  type OvertimeRulesFormFieldValues,
} from "./AddOvertimeRulesForm";
import { ApprovalWorkflowForm } from "./ApprovalWorkflowForm";

type ManualApprovalFormProps = {
  loading?: boolean;
  disabled?: boolean;
  setDeletedApprovalWorkflow: (data: DeletedApprovalWorkflow[]) => void;
  deletedApprovalWorkflow: DeletedApprovalWorkflow[];
};

export const ManualApprovalSchema = z.object({
  notice_period_days: z.number().min(0).optional().nullable(),
  notice_period_working_days: z.number().min(0).optional().nullable(),
  allow_past_dated_request: z.boolean().optional(),
  is_comment_required: z.boolean().optional(),
  maximum_past_request_days: z.number().min(0).nullable().optional(),
  manager_can_submit: z.boolean().optional(),
  skip_approver_if_not_assigned: z.boolean().optional(),
  is_notice_period_days: z.boolean().optional(),
  approval_workflow: z.array(
    z.object({
      id: z.string().optional(),
      level: z.number().min(1),
      is_auto_approve_days_enabled: z.boolean(),
      auto_approve_days: z.number().nullable().optional(),
      assignments: z.array(z.string()),
    })
  ),
});

export type ManualApprovalSchemaValues = z.infer<typeof ManualApprovalSchema>;

const ManualApprovalForm = ({
  loading = false,
  disabled = false,
  setDeletedApprovalWorkflow,
  deletedApprovalWorkflow,
}: ManualApprovalFormProps) => {
  const {
    control,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<OvertimeRulesFormFieldValues>();

  const allowPastDatedRequest = watch(
    `${submissionType}.allow_past_dated_request`
  );

  const approvalWorkflow = watch(`${submissionType}.approval_workflow`);

  useEffect(() => {
    if (approvalWorkflow) {
      approvalWorkflow.forEach((workflow, index) => {
        if (!workflow.is_auto_approve_days_enabled) {
          setValue(
            `${submissionType}.approval_workflow.${index}.auto_approve_days`,
            null,
            { shouldDirty: false }
          );
          clearErrors(
            `${submissionType}.approval_workflow.${index}.auto_approve_days`
          );
        }
      });
    }
  }, [approvalWorkflow]);

  const isNoticePeriodDays = watch(`${submissionType}.is_notice_period_days`);

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const {
    notice_period_days,
    notice_period_working_days,
    maximum_past_request_days,
  } = errors.submission_and_approval_details ?? {};

  return (
    <Stack gap="20px">
      <Stack gap="10px">
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          What is the required notice period for requesting overtime?
        </Typography>

        <Stack paddingLeft="20px" gap="10px">
          <Stack direction="row" gap="10px" alignItems="center">
            <Typography variant="body1">A prior notice of</Typography>

            <TextField
              name={`${submissionType}.notice_period_days`}
              control={control}
              loading={loading}
              required
              type="number"
              disabled={disabled}
              error={!!notice_period_days}
              helperText={errorMessages(notice_period_days?.message)}
            />

            <Typography variant="body1">
              calendar days is required, which must include at least
            </Typography>

            <TextField
              name={`${submissionType}.notice_period_working_days`}
              control={control}
              loading={loading}
              required
              disabled={disabled}
              type="number"
              error={!!notice_period_working_days}
              helperText={errorMessages(notice_period_working_days?.message)}
            />

            <Typography variant="body1">working days</Typography>
          </Stack>

          <Stack direction="row" gap="10px">
            <CheckBox
              name={`${submissionType}.is_comment_required`}
              control={control}
              size="small"
              loading={loading}
              disabled={disabled}
            />

            <InputLabel>
              A comment is mandatory when submitting an Overtime request.
            </InputLabel>
          </Stack>
        </Stack>
      </Stack>

      <Stack gap="10px">
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          Can employees submit past dated overtime requests?
        </Typography>

        <Stack paddingLeft="20px" gap="10px">
          <Stack direction="row" gap="10px" alignItems="center">
            <RadioGroupField
              name={`${submissionType}.allow_past_dated_request`}
              control={control}
              loading={loading}
              disabled={disabled}
              direction="column"
              sx={{
                alignItems: "flex-start ",
              }}
              label=""
              options={[
                {
                  label: "Yes, employees can submit past dated requests.",
                  values: true,
                  disabled: disabled ? true : false,
                },
                {
                  label: (
                    <Box paddingTop="8px">
                      <Stack gap="10px" alignItems="baseline">
                        <Typography variant="body1">
                          No, employees can’t submit past dated requests.
                        </Typography>

                        {!allowPastDatedRequest && (
                          <Stack direction="row" gap="10px" alignItems="center">
                            <CheckBox
                              name={`${submissionType}.is_notice_period_days`}
                              control={control}
                              size="small"
                              loading={loading}
                              disabled={disabled}
                            />

                            <Typography variant="body1">
                              Employees are restricted from submitting
                              past-dated requests that exceed
                            </Typography>

                            <TextField
                              disabled={!isNoticePeriodDays || disabled}
                              name={`${submissionType}.maximum_past_request_days`}
                              control={control}
                              loading={loading}
                              type="number"
                              error={!!maximum_past_request_days}
                              helperText={errorMessages(
                                maximum_past_request_days?.message
                              )}
                            />

                            <Typography variant="body1">
                              Calendar days in past.
                            </Typography>
                          </Stack>
                        )}
                      </Stack>
                    </Box>
                  ),
                  values: false,
                  disabled: disabled || false,
                },
              ]}
            />
          </Stack>

          <Stack direction="row" gap="10px">
            <CheckBox
              name={`${submissionType}.manager_can_submit`}
              control={control}
              size="small"
              loading={loading}
              disabled={disabled}
            />

            <InputLabel>
              The manager can submit an overtime request on behalf of the
              employee.
            </InputLabel>
          </Stack>
        </Stack>
      </Stack>

      <ApprovalWorkflowForm
        setDeletedApprovalWorkflow={setDeletedApprovalWorkflow}
        deletedApprovalWorkflow={deletedApprovalWorkflow}
        disabled={disabled}
      />

      <Stack direction="row" gap="10px">
        <CheckBox
          name={`${submissionType}.skip_approver_if_not_assigned`}
          control={control}
          size="small"
          loading={loading}
          disabled={disabled}
        />

        <InputLabel>
          Automatically approve and skip the approver level if the approver is
          not yet registered or assigned.
        </InputLabel>
      </Stack>
    </Stack>
  );
};

export const MemoizedManualApprovalForm = memo(ManualApprovalForm);

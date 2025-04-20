import { CheckBox } from "@codezee/sixtify-brahma";
import { InputLabel, Stack, Typography } from "@mui/material";
import { memo } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import {
  submissionType,
  type DeletedApprovalWorkflow,
  type OvertimeRulesFormFieldValues,
} from "./AddOvertimeRulesForm";
import { ApprovalWorkflowForm } from "./ApprovalWorkflowForm";

type AutoApprovalFormProps = {
  loading?: boolean;
  disabled?: boolean;
  setDeletedApprovalWorkflow: (data: DeletedApprovalWorkflow[]) => void;
  deletedApprovalWorkflow: DeletedApprovalWorkflow[];
};

export const AutoApprovalFormSchema = z.object({
  skip_approver_if_not_assigned: z.boolean().optional(),
  approval_workflow: z.array(
    z.object({
      level: z.number().min(1),
      is_auto_approve_days_enabled: z.boolean(),
      auto_approve_days: z.number().nullable().optional(),
      assignments: z.array(
        z.object({
          type: z.string().nullable(),
          id: z.string().nullable(),
        })
      ),
    })
  ),
});

export type AutoApprovalFormValues = z.infer<typeof AutoApprovalFormSchema>;

const AutoApprovalForm = ({
  loading = false,
  disabled = false,
  deletedApprovalWorkflow,
  setDeletedApprovalWorkflow,
}: AutoApprovalFormProps) => {
  const { control } = useFormContext<OvertimeRulesFormFieldValues>();

  return (
    <Stack gap="20px">
      <Stack gap="10px">
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          What is the required notice period for requesting overtime?
        </Typography>
      </Stack>

      <ApprovalWorkflowForm
        deletedApprovalWorkflow={deletedApprovalWorkflow}
        setDeletedApprovalWorkflow={setDeletedApprovalWorkflow}
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

export const MemoizedAutoApprovalForm = memo(AutoApprovalForm);

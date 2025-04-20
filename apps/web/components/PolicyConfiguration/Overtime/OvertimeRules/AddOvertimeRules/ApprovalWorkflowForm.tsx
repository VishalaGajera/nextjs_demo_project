import {
  Autocomplete,
  Button,
  CheckBox,
  DeleteAction,
  TextField,
} from "@codezee/sixtify-brahma";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Divider, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import type { EmployeeOption } from "../../../../common/Autocomplete/hooks/useGetEmployeeOption";
import { useGetEmployeeOption } from "../../../../common/Autocomplete/hooks/useGetEmployeeOption";
import {
  submissionType,
  type DeletedApprovalWorkflow,
  type OvertimeRulesFormFieldValues,
} from "./AddOvertimeRulesForm";

export const ApprovalWorkflowFormSchema = z
  .object({
    approval_workflow: z.array(
      z.object({
        level: z.number().min(1),
        is_auto_approve_days_enabled: z.boolean(),
        auto_approve_days: z.number().nullable().optional(),
        assignments: z.array(z.string().nullable()),
      })
    ),
  })
  .superRefine((value, ctx) => {
    value.approval_workflow.forEach((workflow, index) => {
      if (
        workflow.is_auto_approve_days_enabled &&
        workflow.auto_approve_days === null
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [
            "submission_and_approval_details",
            "approval_workflow",
            index,
            "auto_approve_days",
          ],
          message: "common.required",
        });
      }
    });
  });

export type ApprovalWorkflowFormValues = z.infer<
  typeof ApprovalWorkflowFormSchema
>;
type ApprovalWorkflowFormProps = {
  setDeletedApprovalWorkflow: (data: DeletedApprovalWorkflow[]) => void;
  deletedApprovalWorkflow: DeletedApprovalWorkflow[];
  disabled?: boolean;
};
export const ApprovalWorkflowForm = ({
  setDeletedApprovalWorkflow,
  deletedApprovalWorkflow,
  disabled = false,
}: ApprovalWorkflowFormProps) => {
  const {
    control,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<OvertimeRulesFormFieldValues>();

  const companyId = watch("company_id") ?? "";

  const theme = useTheme();

  const { sapphireBlue, black } = theme.palette.app.color;

  const approvalWorkflow = watch(`${submissionType}.approval_workflow`);

  const { data: employeeCodeOptions } = useGetEmployeeOption({
    companyId,
    queryParams: {
      avatar: true,
    },
  });

  const allAssignments: string[] = approvalWorkflow
    ?.flatMap((level) => level.assignments)
    ?.filter((assignment) => typeof assignment === "string");

  const handleAddNewRow = () => {
    const updatedWorkflowData = Array.isArray(approvalWorkflow)
      ? [...approvalWorkflow]
      : [];

    updatedWorkflowData.push({
      level: updatedWorkflowData.length + 1,
      is_auto_approve_days_enabled: false,
      auto_approve_days: null,
      assignments: [],
    });

    setValue(`${submissionType}.approval_workflow`, updatedWorkflowData);
  };

  const getUpdatedOptions = (index: number) => {
    const approvalWorkflowData = watch(
      `${submissionType}.approval_workflow.${index}.assignments`
    );

    const options = employeeCodeOptions.filter(
      (option: EmployeeOption) =>
        !(
          !approvalWorkflowData?.includes(option.value) &&
          allAssignments?.includes(option.value)
        ) && option
    );

    return options;
  };

  const handleRemoveRow = (index: number, id?: string) => {
    clearErrors(`${submissionType}.approval_workflow`);

    if (approvalWorkflow.length == 2) {
      setValue(
        `${submissionType}.approval_workflow.${index - 1}.is_auto_approve_days_enabled`,
        false,
        { shouldDirty: true }
      );
      setValue(
        `${submissionType}.approval_workflow.${index - 1}.auto_approve_days`,
        0,
        { shouldDirty: false }
      );
    }

    if (id) {
      setDeletedApprovalWorkflow([
        ...deletedApprovalWorkflow,
        {
          id,
          action: "delete",
        },
      ]);
    }

    approvalWorkflow?.splice(index, 1);
    setValue(`${submissionType}.approval_workflow`, approvalWorkflow);
  };

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  return (
    <Stack gap="20px">
      <Typography fontWeight={600} variant="body1">
        Approval Workflow :
      </Typography>

      {approvalWorkflow?.map((workflow, index) => {
        const isAutoApproveDaysEnabled = watch(
          `${submissionType}.approval_workflow.${index}.is_auto_approve_days_enabled`
        );

        return (
          <Stack
            // eslint-disable-next-line sonarjs/no-array-index-key
            key={index}
            maxWidth="900px"
            paddingLeft="20px"
            gap="15px"
          >
            <Typography fontWeight={600} variant="body1">
              LEVEL {index + 1} :
            </Typography>
            <Stack direction="row" alignItems="center" gap="10px">
              <Autocomplete
                disabled={!companyId || disabled}
                multiple
                placeholder="Search Roles / Employees"
                isShowOptionsOnType
                maxLimit={5}
                required
                isShowAvatar
                isShowSelectAll={false}
                label="Roles / Employees"
                options={getUpdatedOptions(index)}
                sx={{
                  minWidth: "900px",
                  "& .MuiAutocomplete-tag": {
                    backgroundColor: sapphireBlue[300],
                    color: black[900],
                  },
                }}
                name={`${submissionType}.approval_workflow.${index}.assignments`}
                control={control}
                error={
                  !!errors?.submission_and_approval_details
                    ?.approval_workflow?.[index]?.assignments
                }
                helperText={errorMessages(
                  errors?.submission_and_approval_details?.approval_workflow?.[
                    index
                  ]?.assignments?.message
                )}
              />

              {approvalWorkflow.length > 1 && (
                <DeleteAction
                  onClick={() => handleRemoveRow(index, workflow?.id)}
                ></DeleteAction>
              )}
            </Stack>

            {approvalWorkflow.length > 1 &&
              approvalWorkflow.length !== index + 1 && (
                <>
                  <Divider />
                  <Stack direction="row" gap="10px" alignItems="center">
                    <CheckBox
                      name={`${submissionType}.approval_workflow.${index}.is_auto_approve_days_enabled`}
                      control={control}
                      size="small"
                      disabled={disabled}
                    />
                    <Typography variant="body1">
                      Auto approve and skip this level if no action taken in
                    </Typography>

                    <TextField
                      name={`${submissionType}.approval_workflow.${index}.auto_approve_days`}
                      control={control}
                      type="number"
                      required={isAutoApproveDaysEnabled}
                      error={
                        !!errors?.submission_and_approval_details
                          ?.approval_workflow?.[index]?.auto_approve_days
                      }
                      helperText={errorMessages(
                        errors?.submission_and_approval_details
                          ?.approval_workflow?.[index]?.auto_approve_days
                          ?.message
                      )}
                      disabled={disabled || !isAutoApproveDaysEnabled}
                    />

                    <Typography variant="body1">Days.</Typography>
                  </Stack>
                </>
              )}
          </Stack>
        );
      })}

      {(!approvalWorkflow || approvalWorkflow.length < 5) && (
        <Divider>
          <Button
            variant="outlined"
            onClick={handleAddNewRow}
            disabled={disabled}
          >
            <AddRoundedIcon fontSize="small" />
            Add Level
          </Button>
        </Divider>
      )}
    </Stack>
  );
};

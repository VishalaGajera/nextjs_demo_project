import {
  Autocomplete,
  Button,
  CheckBox,
  DeleteAction,
  PadBox,
  TextField,
} from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import {
  Box,
  Divider,
  InputLabel,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { t } from "i18next";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import type { EmployeeOption } from "../../../../../../common/Autocomplete/hooks/useGetEmployeeOption";
import { useGetEmployeeOption } from "../../../../../../common/Autocomplete/hooks/useGetEmployeeOption";
import type { ConfigureLeaveFormFieldValues } from "../ConfigureLeaveForm";

const approvalChainSchema = z.object({
  is_auto_approve_days_enabled: z.boolean().optional(),
  auto_approve_days: z
    .number()
    .int({ message: "Days should not be in point." })
    .nullable()
    .optional(),
  level_approvers: z.array(z.string()).nullable(),
});

export const LeaveApprovalFormSchema = z
  .object({
    is_approval_required: z.boolean(),
    skip_if_approver_does_not_exist: z.boolean(),
    approval_levels: z.array(approvalChainSchema).nullable(),
  })
  .superRefine((data, ctx) => {
    const isRequireApproval = data.is_approval_required;

    const approvalChainData = data.approval_levels;

    if (data.is_approval_required && approvalChainData?.length) {
      approvalChainData.forEach((item, index) => {
        if (item.is_auto_approve_days_enabled && !item.auto_approve_days) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [`approval_levels.${index}.auto_approve_days`],
            message: "common.required",
          });
        }

        if (
          item.is_auto_approve_days_enabled &&
          item.auto_approve_days &&
          item.auto_approve_days > 365
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [`approval_levels.${index}.auto_approve_days`],
            message: "Days should not be more then 365",
          });
        }

        if (isRequireApproval && !item.level_approvers) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [`approval_levels.${index}.level_approvers`],
            message: "common.required",
          });
        }
      });
    }
  });

export type LeaveApprovalFormFieldValues = z.infer<
  typeof LeaveApprovalFormSchema
>;

export const LeaveApprovalFormDefaultValues: LeaveApprovalFormFieldValues = {
  is_approval_required: false,
  skip_if_approver_does_not_exist: false,
  approval_levels: [
    {
      level_approvers: null,
    },
  ],
};

type LeaveApprovalFormProps = {
  companyId: string;
  disabled: boolean;
};

export const LeaveApprovalForm = ({
  companyId,
  disabled = false,
}: LeaveApprovalFormProps) => {
  const theme = useTheme();

  const { iron, sapphireBlue, black } = theme.palette.app.color;

  const {
    control,
    watch,
    setValue,
    clearErrors,
    resetField,
    formState: { errors },
  } = useFormContext<ConfigureLeaveFormFieldValues>();

  const isRequireApproval = watch("leave_approval.is_approval_required");

  const approvalChain = watch("leave_approval.approval_levels");

  const { data: employeeCodeOptions } = useGetEmployeeOption({
    companyId: isRequireApproval ? companyId : "",
    queryParams: {
      avatar: true,
    },
  });

  const handleAddLeave = () => {
    if (approvalChain?.length) {
      const newLevelArray = approvalChain.map((item, index) => {
        if (index === approvalChain.length - 1) {
          return {
            level_approvers: item.level_approvers,
            is_auto_approve_days_enabled: false,
            auto_approve_days: item.auto_approve_days,
          };
        }

        return item;
      });

      newLevelArray.push({
        level_approvers: null,
      });

      setValue("leave_approval.approval_levels", newLevelArray);
    }
  };

  const handleRemoveLevel = (index: number) => {
    if (approvalChain?.length) {
      const updatedArray = approvalChain
        .filter((_, i) => i !== index)
        .map((item, i, arr) => {
          if (i === arr.length - 1) {
            return {
              level_approvers: item.level_approvers,
            };
          }

          return {
            level_approvers: item.level_approvers,
            is_auto_approve_days_enabled: item.is_auto_approve_days_enabled,
            auto_approve_days: item.auto_approve_days,
          };
        });

      clearErrors(`leave_approval.approval_levels.${index}`);

      setValue("leave_approval.approval_levels", updatedArray);
    }
  };

  const allAssignments = approvalChain
    ?.flatMap((item) => item.level_approvers)
    ?.filter((assignment) => typeof assignment === "string");

  const getUpdatedOptions = (index: number) => {
    const approvalWorkflowData = watch(
      `leave_approval.approval_levels.${index}.level_approvers`
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

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const { approval_levels } = errors.leave_approval ?? {};

  useEffect(() => {
    if (!isRequireApproval) {
      resetField("leave_approval.approval_levels");
    }
  }, [isRequireApproval]);

  useEffect(() => {
    approvalChain?.forEach((item, index) => {
      if (!item.is_auto_approve_days_enabled) {
        resetField(`leave_approval.approval_levels.${index}.auto_approve_days`);
      }
    });
  }, [JSON.stringify(approvalChain)]);

  return (
    <Stack gap="15px">
      <Stack direction="row" gap="10px">
        <CheckBox
          name="leave_approval.is_approval_required"
          control={control}
          size="small"
          disabled={disabled}
        />

        <Typography>Does the leave request require approval?</Typography>
      </Stack>

      {isRequireApproval && (
        <>
          <Stack gap="10px">
            <Typography fontWeight={600} variant="body1">
              Approval Workflow :
            </Typography>

            <Box
              border="1px solid"
              borderRadius="5px"
              borderColor={iron[700]}
              sx={{ cursor: "default" }}
            >
              <PadBox padding={{ padding: "20px" }}>
                <Stack gap="20px">
                  {approvalChain?.map((item, index) => {
                    const skipToNextLevel = watch(
                      `leave_approval.approval_levels.${index}.is_auto_approve_days_enabled`
                    );
                    // used index in key, having issues in input filed focus while using uuidv4

                    return (
                      <Stack
                        // eslint-disable-next-line sonarjs/no-array-index-key
                        key={index}
                        gap="15px"
                      >
                        <Typography fontWeight={600} variant="body1">
                          LEVEL {index + 1}:
                        </Typography>

                        <Stack direction="row" gap="10px">
                          <Autocomplete
                            disabled={!companyId || disabled}
                            multiple
                            placeholder="Search Employees / Roles"
                            isShowOptionsOnType
                            isShowAvatar
                            isShowSelectAll={false}
                            label="Employees / Roles"
                            options={getUpdatedOptions(index)}
                            sx={{
                              minWidth: "900px",
                              "& .MuiAutocomplete-tag": {
                                backgroundColor: sapphireBlue[300],
                                color: black[900],
                              },
                            }}
                            name={`leave_approval.approval_levels.${index}.level_approvers`}
                            control={control}
                            error={!!approval_levels?.[index]?.level_approvers}
                            helperText={errorMessages(
                              approval_levels?.[index]?.level_approvers?.message
                            )}
                          />

                          {!!index && (
                            <DeleteAction
                              sx={{ height: "20px" }}
                              onClick={() => handleRemoveLevel(index)}
                              disabled={disabled}
                            />
                          )}
                        </Stack>

                        {approvalChain.length > 1 &&
                          approvalChain.length !== index + 1 && (
                            <>
                              <Stack
                                direction="row"
                                gap="10px"
                                alignItems="baseline"
                              >
                                <CheckBox
                                  name={`leave_approval.approval_levels.${index}.is_auto_approve_days_enabled`}
                                  control={control}
                                  size="small"
                                  sx={{ top: "3px" }}
                                  disabled={disabled}
                                />

                                <Typography variant="body1">
                                  Auto approve and skip this level if no action
                                  taken in
                                </Typography>

                                <TextField
                                  name={`leave_approval.approval_levels.${index}.auto_approve_days`}
                                  control={control}
                                  type="number"
                                  disabled={!skipToNextLevel || disabled}
                                  error={
                                    !!approval_levels?.[index]
                                      ?.auto_approve_days
                                  }
                                  helperText={errorMessages(
                                    approval_levels?.[index]?.auto_approve_days
                                      ?.message
                                  )}
                                />

                                <InputLabel>days.</InputLabel>
                              </Stack>

                              <Divider />
                            </>
                          )}
                      </Stack>
                    );
                  })}

                  {approvalChain && approvalChain.length < 5 && (
                    <Divider>
                      <Button
                        onClick={() => handleAddLeave()}
                        startIcon={<Add />}
                        disabled={disabled}
                      >
                        Add Level
                      </Button>
                    </Divider>
                  )}
                </Stack>
              </PadBox>
            </Box>
          </Stack>

          <Stack direction="row" gap="10px">
            <CheckBox
              name="leave_approval.skip_if_approver_does_not_exist"
              control={control}
              size="small"
              disabled={disabled}
            />

            <Typography>
              Automatically approve if the approver is not yet registered or
              assigned
            </Typography>
          </Stack>
        </>
      )}
    </Stack>
  );
};

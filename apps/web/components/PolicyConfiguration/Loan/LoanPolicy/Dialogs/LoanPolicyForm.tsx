import {
  Button,
  CheckBox,
  DeleteAction,
  FormRow,
  PadBox,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add } from "@mui/icons-material";
import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import {
  type ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../hooks/useEnableDisableButton";
import { filterNestedChangedFormFields } from "../../../../../utils/helper";
import { ApproverAutocomplete } from "../../../../common/Autocomplete/ApproverAutocomplete";
import { CompanyAutocomplete } from "../../../../common/Autocomplete/CompanyAutocomplete";
import {
  type EmployeeOption,
  useGetEmployeeOption,
} from "../../../../common/Autocomplete/hooks/useGetEmployeeOption";

const approvalChainSchema = z.object({
  is_auto_approve_days_enabled: z.boolean().optional(),
  auto_approve_days: z
    .number()
    .int({ message: "Days should not be in point." })
    .nullable()
    .optional(),
  level_approvers: z.array(z.string()).nullable(),
});

const LoanPolicyFormSchema = z
  .object({
    company_id: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    loan_policy_code: z
      .string()
      .min(2, {
        message: t("common.invalidMinLimit", { minLimit: 2 }),
      })
      .max(20, {
        message: t("common.invalidMaxLimit", { maxLimit: 20 }),
      })
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    loan_policy_name: z
      .string()
      .max(50, {
        message: t("common.invalidMaxLimit", { maxLimit: 50 }),
      })
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    description: z
      .string()
      .max(250, {
        message: t("common.invalidMaxLimit", { maxLimit: 250 }),
      })
      .nullable(),
    is_approval_required: z.boolean().nullable(),
    approval_levels: z.array(approvalChainSchema).nullable(),
    skip_if_approver_does_not_exist: z.boolean(),
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

export type LoanPolicyFormFieldValues = z.infer<typeof LoanPolicyFormSchema>;

type LevelApprover = {
  approver_type: string;
  employee_id: string;
};

type LevelApproval = {
  is_auto_approve_days_enabled: boolean;
  level_approvers?: LevelApprover[];
  auto_approve_days?: number | null;
};

export type LoanPolicyPayload = Omit<
  LoanPolicyFormFieldValues,
  "approval_levels"
> & {
  approval_levels: LevelApproval[];
};

type LoanPolicyFormProps = {
  defaultValues?: LoanPolicyFormFieldValues;
  loading?: boolean;
  disabled?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<LoanPolicyPayload>) => void
  ) => void;
  setError: UseFormSetError<LoanPolicyFormFieldValues>;
};

const formDefaultValues: LoanPolicyFormFieldValues = {
  company_id: null,
  loan_policy_code: null,
  loan_policy_name: null,
  description: null,
  is_approval_required: false,
  approval_levels: [
    {
      level_approvers: null,
    },
  ],
  skip_if_approver_does_not_exist: false,
};

export const LoanPolicyForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
    }: LoanPolicyFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const theme = useTheme();

    const { iron } = theme.palette.app.color;

    const { t } = useTranslation();

    const {
      watch,
      control,
      setValue,
      setError,
      resetField,
      clearErrors,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(LoanPolicyFormSchema),
      mode: "all",
    });

    const companyId = watch("company_id") ?? "";

    const isRequireApproval = watch("is_approval_required");

    const approvalChain = watch("approval_levels");

    const { data: employeeCodeOptions } = useGetEmployeeOption({
      companyId,
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

        setValue("approval_levels", newLevelArray);
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

        clearErrors(`approval_levels.${index}`);

        setValue("approval_levels", updatedArray);
      }
    };

    const allAssignments = approvalChain
      ?.flatMap((item) => item.level_approvers)
      ?.filter((assignment) => typeof assignment === "string");

    const getUpdatedOptions = (index: number) => {
      const approvalWorkflowData = watch(
        `approval_levels.${index}.level_approvers`
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

    const {
      approval_levels,
      company_id,
      description,
      loan_policy_code,
      loan_policy_name,
    } = errors;

    useEffect(() => {
      if (!isRequireApproval) {
        resetField("approval_levels");
      }
    }, [isRequireApproval]);

    useEffect(() => {
      approvalChain?.forEach((item, index) => {
        if (!item.is_auto_approve_days_enabled) {
          resetField(`approval_levels.${index}.auto_approve_days`);
        }
      });
    }, [JSON.stringify(approvalChain)]);

    useEnableDisableButton({ control, defaultValues, errors });

    const prepareLeaveApprovalTypeValues = (
      formData: Partial<LoanPolicyFormFieldValues>
    ) => {
      if (formData) {
        return formData.approval_levels?.map((item) => {
          return {
            ...item,
            is_auto_approve_days_enabled:
              item.is_auto_approve_days_enabled || false,
            level_approvers: item.level_approvers?.map((level_approvers) => {
              return {
                approver_type: "by_employee",
                employee_id: level_approvers,
              };
            }),
          };
        });
      }
    };

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterNestedChangedFormFields(formValues, {
            ...dirtyFields,
            skip_if_approver_does_not_exist: true,
          });

          const LoanApprovalValues = prepareLeaveApprovalTypeValues(formValues);

          const payload = {
            ...filterFormValues,
            is_approval_required: formValues.is_approval_required,
            ...(formValues.is_approval_required && {
              skip_if_approver_does_not_exist:
                formValues.skip_if_approver_does_not_exist,
            }),
            // eslint-disable-next-line sonarjs/no-nested-functions
            approval_levels: LoanApprovalValues?.map((level) => ({
              ...level,
              auto_approve_days:
                !level.is_auto_approve_days_enabled ||
                level.auto_approve_days === null
                  ? undefined
                  : level.auto_approve_days,
            })),
          };

          if (!formValues.is_approval_required) {
            delete payload.approval_levels;
          }

          if (!formValues.is_approval_required) {
            delete payload.skip_if_approver_does_not_exist;
          }

          onSubmit(payload);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    return (
      <Stack gap="16px">
        <FormRow>
          <CompanyAutocomplete
            control={control}
            error={!!company_id}
            loading={loading}
            disabled={!!defaultValues.company_id || !!disabled}
            helperText={errorMessages(company_id?.message)}
            name="company_id"
            required
          />
        </FormRow>

        <FormRow maxColumn={3}>
          <TextField
            label="Loan Policy Code"
            name="loan_policy_code"
            control={control}
            disabled={!!defaultValues.loan_policy_code || !!disabled}
            loading={loading}
            required
            error={!!loan_policy_code}
            helperText={errorMessages(loan_policy_code?.message)}
          />

          <TextField
            label="Loan Policy Name"
            name="loan_policy_name"
            control={control}
            loading={loading}
            required
            disabled={!!disabled}
            error={!!loan_policy_name}
            helperText={errorMessages(loan_policy_name?.message)}
          />

          <TextField
            name="description"
            control={control}
            loading={loading}
            label="Description"
            error={!!description}
            disabled={!!disabled}
            helperText={errorMessages(description?.message)}
          />
        </FormRow>

        <Stack gap="15px">
          <Stack direction="row" gap="10px">
            <CheckBox
              name="is_approval_required"
              control={control}
              loading={loading}
              disabled={!!disabled}
              size="small"
            />

            <Typography>Does the loan request require approval?</Typography>
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
                      {approvalChain?.map((_item, index) => {
                        const skipToNextLevel = watch(
                          `approval_levels.${index}.is_auto_approve_days_enabled`
                        );

                        return (
                          <Stack key={index + 1} gap="15px">
                            <Typography fontWeight={600} variant="body1">
                              LEVEL {index + 1}:
                            </Typography>

                            <Stack direction="row" gap="10px">
                              <ApproverAutocomplete
                                disabled={!companyId || !!disabled}
                                options={getUpdatedOptions(index)}
                                name={`approval_levels.${index}.level_approvers`}
                                control={control}
                                loading={loading}
                                error={
                                  !!approval_levels?.[index]?.level_approvers
                                }
                                helperText={errorMessages(
                                  approval_levels?.[index]?.level_approvers
                                    ?.message
                                )}
                              />

                              {!!index && (
                                <DeleteAction
                                  sx={{ height: "20px" }}
                                  onClick={() => handleRemoveLevel(index)}
                                  disabled={!!disabled}
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
                                      name={`approval_levels.${index}.is_auto_approve_days_enabled`}
                                      control={control}
                                      disabled={!!disabled}
                                      size="small"
                                      sx={{ top: "3px" }}
                                    />

                                    <Typography variant="body1">
                                      Auto approve and skip this level if no
                                      action taken in
                                    </Typography>

                                    <TextField
                                      name={`approval_levels.${index}.auto_approve_days`}
                                      control={control}
                                      type="number"
                                      disabled={!skipToNextLevel || !!disabled}
                                      loading={loading}
                                      error={
                                        !!approval_levels?.[index]
                                          ?.auto_approve_days
                                      }
                                      helperText={errorMessages(
                                        approval_levels?.[index]
                                          ?.auto_approve_days?.message
                                      )}
                                    />

                                    <Typography variant="body1">
                                      days.
                                    </Typography>
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
                            disabled={!!disabled}
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
                  name="skip_if_approver_does_not_exist"
                  control={control}
                  disabled={!!disabled}
                  size="small"
                />

                <Typography>
                  Automatically approve if the approver is not yet registered or
                  assigned
                </Typography>
              </Stack>
            </>
          )}
        </Stack>
      </Stack>
    );
  }
);

LoanPolicyForm.displayName = "LoanPolicyForm";

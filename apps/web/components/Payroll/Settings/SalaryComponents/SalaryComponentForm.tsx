import {
  CheckBox,
  FormRow,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputLabel, Stack, Typography } from "@mui/material";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../hooks/useEnableDisableButton";
import {
  filterChangedFormFields,
  validateMaxDigit,
} from "../../../../utils/helper";
import {
  alphaNumericRegex,
  alphaNumericSpaceRegex,
} from "../../../../utils/regex";
import { DeductionComponentAutocomplete } from "../../../common/Autocomplete/DeductionComponentAutocomplete";

export type SalaryComponent = {
  id: string;
  calculation_type: "recurring" | "one_time";
  deduction_component_type?: string;
  deduction_component_code?: string;
  deduction_component_name?: string;
  contribution_component_code?: string;
  contribution_component_name?: string;
  reimbursement_component_code?: string;
  reimbursement_component_name?: string;
  description: string;
  is_taxable: boolean;
  tax_exemption_limit?: number;
  is_proof_required?: boolean;
  is_claim_required?: boolean;
  is_system_generated: boolean;
};

const SalaryComponentFormSchema = z.object({
  calculation_type: z
    .enum(["recurring", "one_time"])
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  deduction_component_type: z.string().trim().nullable().optional(),
  deduction_component_code: z
    .string()
    .trim()
    .regex(alphaNumericRegex, {
      message: "common.alphanumeric",
    })
    .nullable()
    .optional(),
  deduction_component_name: z
    .string()
    .trim()
    .regex(alphaNumericSpaceRegex, {
      message: "common.alphanumericSpaces",
    })
    .nullable()
    .optional(),
  contribution_component_code: z
    .string()
    .trim()
    .regex(alphaNumericRegex, {
      message: "common.alphanumeric",
    })
    .nullable()
    .optional(),
  contribution_component_name: z
    .string()
    .trim()
    .regex(alphaNumericSpaceRegex, {
      message: "common.alphanumericSpaces",
    })
    .nullable()
    .optional(),
  reimbursement_component_code: z
    .string()
    .trim()
    .regex(alphaNumericRegex, {
      message: "common.alphanumeric",
    })
    .nullable()
    .optional(),
  reimbursement_component_name: z
    .string()
    .trim()
    .regex(alphaNumericSpaceRegex, {
      message: "common.alphanumericSpaces",
    })
    .nullable()
    .optional(),
  description: z.string().trim().max(255, "common.maxLength").nullable(),
  is_taxable: z.boolean().optional(),
  tax_exemption_limit: z.number().nullable().optional(),
  is_proof_required: z.boolean().optional(),
  is_claim_required: z.boolean().optional(),
});

export type SalaryComponentFormFieldValues = z.infer<
  typeof SalaryComponentFormSchema
>;

type SalaryComponentFormProps = {
  defaultValues?: SalaryComponentFormFieldValues;
  loading?: boolean;
  type: string;
  dialogType?: "add" | "edit" | "view";
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<SalaryComponentFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<SalaryComponentFormFieldValues>;
};

const formDefaultValues: SalaryComponentFormFieldValues = {
  calculation_type: "recurring",
  deduction_component_type: null,
  deduction_component_code: null,
  deduction_component_name: null,
  contribution_component_code: null,
  contribution_component_name: null,
  description: null,
  is_taxable: true,
  tax_exemption_limit: null,
  is_proof_required: false,
};

const validateFields = (
  fields: string[],
  val: Record<string, string | number | boolean | null>,
  ctx: z.RefinementCtx
) => {
  fields.forEach((field) => {
    if (!val[field]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: [field],
      });
    }
  });
};

export const SalaryComponentForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      type,
      dialogType = "add",
    }: SalaryComponentFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const TypeValidationSchema = SalaryComponentFormSchema.superRefine(
      (val, ctx) => {
        if (type !== "reimbursement" && !val.is_taxable) {
          validateMaxDigit(ctx, "tax_exemption_limit", val.tax_exemption_limit);
        }
      }
    );

    const UpdatedSchema = TypeValidationSchema.superRefine((val, ctx) => {
      const typeValidationMap: Record<string, string[]> = {
        deduction: [
          "deduction_component_code",
          "deduction_component_name",
          "deduction_component_type",
        ],
        contribution: [
          "contribution_component_code",
          "contribution_component_name",
        ],
        reimbursement: [
          "reimbursement_component_code",
          "reimbursement_component_name",
        ],
      };

      if (typeValidationMap[type]) {
        validateFields(typeValidationMap[type], val, ctx);
      }
    });

    const {
      watch,
      control,
      clearErrors,
      setError,
      setValue,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(UpdatedSchema),
      mode: "all",
    });

    const isTaxable = watch("is_taxable");

    const isEdit = dialogType === "edit";

    const isView = dialogType === "view";

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(
            formValues,
            isEdit
              ? dirtyFields
              : {
                  ...dirtyFields,
                  calculation_type: true,
                  ...(type !== "reimbursement" && { is_taxable: true }),
                }
          );

          onSubmit(filterFormValues);
        })();
      },
      setError,
    }));

    useMemo(() => {
      if (isTaxable) {
        setValue("tax_exemption_limit", null);
        setValue("is_proof_required", false);
        clearErrors("tax_exemption_limit");
      }
    }, [isTaxable]);

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    return (
      <Stack gap="16px">
        <FormRow maxColumn={2}>
          <RadioGroupField
            name="calculation_type"
            label="Calculation Type"
            control={control}
            loading={loading}
            options={[
              {
                values: "recurring",
                label: "Recurring",
                disabled: isEdit || isView,
              },
              {
                values: "one_time",
                label: "One Time",
                disabled: isEdit || isView,
              },
            ]}
          />

          {type === "deduction" && (
            <DeductionComponentAutocomplete
              name="deduction_component_type"
              control={control}
              required
              loading={loading}
              disabled={isEdit || isView}
              error={!!errors.deduction_component_type}
              helperText={errorMessages(
                errors.deduction_component_type?.message
              )}
            />
          )}
        </FormRow>

        <FormRow maxColumn={2}>
          {type === "deduction" && (
            <>
              <TextField
                name="deduction_component_code"
                control={control}
                label="Deduction Component Code"
                loading={loading}
                disabled={isEdit || isView}
                error={!!errors.deduction_component_code}
                helperText={errorMessages(
                  errors.deduction_component_code?.message
                )}
                required
              />

              <TextField
                name="deduction_component_name"
                control={control}
                label="Deduction Component Name"
                loading={loading}
                error={!!errors.deduction_component_name}
                helperText={errorMessages(
                  errors.deduction_component_name?.message
                )}
                required
                disabled={isView}
              />
            </>
          )}
          {type === "contribution" && (
            <>
              <TextField
                name="contribution_component_code"
                control={control}
                label="Contribution Component Code"
                loading={loading}
                disabled={isEdit || isView}
                error={!!errors.contribution_component_code}
                helperText={errorMessages(
                  errors.contribution_component_code?.message
                )}
                required
              />

              <TextField
                name="contribution_component_name"
                control={control}
                label="Contribution Component Name"
                loading={loading}
                error={!!errors.contribution_component_name}
                helperText={errorMessages(
                  errors.contribution_component_name?.message
                )}
                required
                disabled={isView}
              />
            </>
          )}
          {type === "reimbursement" && (
            <>
              <TextField
                name="reimbursement_component_code"
                control={control}
                label="Reimbursement Component Code"
                loading={loading}
                disabled={isEdit || isView}
                error={!!errors.reimbursement_component_code}
                helperText={errorMessages(
                  errors.reimbursement_component_code?.message
                )}
                required
              />

              <TextField
                name="reimbursement_component_name"
                control={control}
                label="Reimbursement Component Name"
                loading={loading}
                error={!!errors.reimbursement_component_name}
                helperText={errorMessages(
                  errors.reimbursement_component_name?.message
                )}
                required
                disabled={isView}
              />
            </>
          )}
        </FormRow>

        <TextField
          name="description"
          control={control}
          label="Description"
          loading={loading}
          error={!!errors.description}
          helperText={errorMessages(errors.description?.message)}
          disabled={isView}
        />

        {type === "reimbursement" ? (
          <Stack direction="row" gap="10px">
            <CheckBox
              name="is_claim_required"
              loading={loading}
              control={control}
              size="small"
              disabled={isView}
            />

            <InputLabel>
              Employee Must Submit a Claim for This Reimbursement
            </InputLabel>
          </Stack>
        ) : (
          <RadioGroupField
            name="is_taxable"
            sx={{
              alignItems: "flex-start",
              "& .MuiFormControlLabel-label": {
                paddingTop: "6px",
              },
            }}
            label="Is Component Taxable?"
            control={control}
            loading={loading}
            direction="column"
            options={[
              {
                values: true,
                label: "Yes(Taxable)",
                disabled: isView,
              },
              {
                values: false,
                label: (
                  <Stack gap="10px" alignItems="baseline">
                    <Typography variant="body1">
                      No(Exempted-Non Taxable)
                    </Typography>

                    {!isTaxable && (
                      <Stack gap="10px">
                        <TextField
                          sx={{ maxWidth: "430px" }}
                          name="tax_exemption_limit"
                          type="number"
                          control={control}
                          label="Tax Exemption Limit"
                          loading={loading}
                          error={!!errors.tax_exemption_limit}
                          helperText={errorMessages(
                            errors.tax_exemption_limit?.message
                          )}
                          disabled={isView}
                        />
                        <Stack direction="row" gap="10px">
                          <CheckBox
                            name="is_proof_required"
                            loading={loading}
                            control={control}
                            size="small"
                            disabled={isView}
                          />

                          <InputLabel>
                            Requires Proof/Bill Attachment for Tax Exemption?
                          </InputLabel>
                        </Stack>
                      </Stack>
                    )}
                  </Stack>
                ),
                disabled: isView,
              },
            ]}
          />
        )}
      </Stack>
    );
  }
);

SalaryComponentForm.displayName = "SalaryComponentForm";

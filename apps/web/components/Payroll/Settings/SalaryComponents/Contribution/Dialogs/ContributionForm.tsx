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
import { useEnableDisableButton } from "../../../../../../hooks/useEnableDisableButton";
import { filterChangedFormFields } from "../../../../../../utils/helper";
import {
  alphaNumericRegex,
  alphaNumericSpaceRegex,
  taxExemptionLimitRegex,
} from "../../../../../../utils/regex";
import { CompanyAutocomplete } from "../../../../../common/Autocomplete/CompanyAutocomplete";

const ContributionFormSchema = z
  .object({
    company_id: z
      .string()
      .trim()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    calculation_type: z
      .enum(["recurring", "one_time"])
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    contribution_component_code: z
      .string()
      .trim()
      .regex(alphaNumericRegex, {
        message: "common.alphanumeric",
      })
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    contribution_component_name: z
      .string()
      .trim()
      .regex(alphaNumericSpaceRegex, {
        message: "common.alphanumericSpaces",
      })
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    description: z.string().trim().max(255, "common.maxLength").nullable(),
    is_taxable: z.boolean(),
    tax_exemption_limit: z.number().nullable().optional(),
    is_proof_required: z.boolean().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.is_taxable) {
      if (!val.tax_exemption_limit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["tax_exemption_limit"],
        });
      } else if (
        val.tax_exemption_limit &&
        !taxExemptionLimitRegex.test(val.tax_exemption_limit.toString())
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "tax exemption limit is invalid",
          path: ["tax_exemption_limit"],
        });
      }
    }
  });

export type ContributionFormFieldValues = z.infer<
  typeof ContributionFormSchema
>;

type ContributionFormProps = {
  defaultValues?: ContributionFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<ContributionFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<ContributionFormFieldValues>;
};

const formDefaultValues: ContributionFormFieldValues = {
  company_id: null,
  calculation_type: "recurring",
  contribution_component_code: null,
  contribution_component_name: null,
  description: null,
  is_taxable: false,
  tax_exemption_limit: null,
  is_proof_required: false,
};

export const ContributionForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: ContributionFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const {
      watch,
      control,
      clearErrors,
      setError,
      resetField,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(ContributionFormSchema),
      mode: "all",
    });

    const isTaxable = watch("is_taxable");

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(
            formValues,
            defaultValues.company_id
              ? dirtyFields
              : {
                  ...dirtyFields,
                  calculation_type: true,
                  is_taxable: true,
                }
          );

          onSubmit(filterFormValues);
        })();
      },
      setError,
    }));

    useMemo(() => {
      if (!isTaxable) {
        resetField("tax_exemption_limit");
        resetField("is_proof_required");
        clearErrors("tax_exemption_limit");
      }
    }, [isTaxable]);

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    return (
      <Stack gap="16px">
        <FormRow maxColumn={2}>
          <CompanyAutocomplete
            name="company_id"
            control={control}
            label="Company Name"
            required
            loading={loading}
            disabled={!!defaultValues.company_id}
            error={!!errors.company_id}
            helperText={errorMessages(errors.company_id?.message)}
          />
        </FormRow>

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
                disabled: !!defaultValues.company_id,
              },
              {
                values: "one_time",
                label: "One Time Component",
                disabled: !!defaultValues.company_id,
              },
            ]}
          />
        </FormRow>

        <FormRow maxColumn={2}>
          <TextField
            name="contribution_component_code"
            control={control}
            label="Contribution Component Code"
            loading={loading}
            disabled={!!defaultValues.company_id}
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
          />
        </FormRow>

        <TextField
          name="description"
          control={control}
          label="Description"
          loading={loading}
          error={!!errors.description}
          helperText={errorMessages(errors.description?.message)}
        />

        <RadioGroupField
          name="is_taxable"
          sx={{
            alignItems: "flex-start ",
          }}
          label="Is Component Taxable?"
          control={control}
          loading={loading}
          direction="column"
          options={[
            {
              values: false,
              label: "No(Exempted-Non Taxable)",
              disabled: false,
            },
            {
              values: true,
              label: (
                <Stack gap="10px" alignItems="baseline">
                  <Typography variant="body1" paddingTop="6px">
                    Yes(Taxable)
                  </Typography>

                  {isTaxable && (
                    <FormRow maxColumn={2}>
                      <TextField
                        name="tax_exemption_limit"
                        type="number"
                        control={control}
                        label="Tax Exemption Limit"
                        loading={loading}
                        error={!!errors.tax_exemption_limit}
                        helperText={errorMessages(
                          errors.tax_exemption_limit?.message
                        )}
                        required
                      />

                      <Stack direction="row" gap="10px">
                        <CheckBox
                          name="is_proof_required"
                          loading={loading}
                          control={control}
                          size="small"
                        />

                        <InputLabel>
                          Requires Proof/Bill Attachment for Tax Exemption?
                        </InputLabel>
                      </Stack>
                    </FormRow>
                  )}
                </Stack>
              ),
              disabled: false,
            },
          ]}
        />
      </Stack>
    );
  }
);

ContributionForm.displayName = "ContributionForm";

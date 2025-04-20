import {
  CheckBox,
  FormRow,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, InputLabel, Stack, Typography } from "@mui/material";

import {
  type ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../hooks/useEnableDisableButton";
import {
  filterChangedFormFields,
  validateMaxDigit,
} from "../../../../../../utils/helper";

import {
  alphaNumericRegex,
  alphaNumericSpaceRegex,
} from "../../../../../../utils/regex";
import { EarningComponentTypeAutocomplete } from "../../../../../common/Autocomplete/EarningComponentTypeAutocomplete";

const EarningFormSchema = z
  .object({
    calculation_type: z
      .enum(["recurring", "one_time"])
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    earning_component_type: z
      .enum(["fixed", "allowance", "arrear", "bonus", "advance"])
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    earning_component_code: z
      .string()
      .regex(alphaNumericRegex, {
        message: "common.alphanumeric",
      })
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    earning_component_name: z
      .string()
      .regex(alphaNumericSpaceRegex, {
        message: "common.alphanumericSpaces",
      })
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    max_limit_per_year: z.number().nullable().optional(),
    description: z.string().trim().max(255, "common.maxLength").nullable(),
    is_taxable: z.boolean(),
    tax_exemption_limit: z.number().nullable().optional(),
    is_proof_required: z.boolean().optional(),
    consider_for_pf: z.boolean().optional(),
    consider_for_esi: z.boolean().optional(),
    consider_for_pt: z.boolean().optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.is_taxable) {
      validateMaxDigit(ctx, "tax_exemption_limit", val.tax_exemption_limit);
    }

    validateMaxDigit(ctx, "max_limit_per_year", val.max_limit_per_year);
  });

export type EarningFormSchemaFieldValues = z.infer<typeof EarningFormSchema>;

export type EarningFormProps = {
  defaultValues?: Partial<EarningFormSchemaFieldValues>;
  loading?: boolean;
  dialogType?: "add" | "edit" | "view";
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<EarningFormSchemaFieldValues>) => void
  ) => void;
  setError: UseFormSetError<EarningFormSchemaFieldValues>;
};

const formDefaultValues: EarningFormSchemaFieldValues = {
  calculation_type: "recurring",
  earning_component_type: "allowance",
  earning_component_code: null,
  earning_component_name: null,
  max_limit_per_year: null,
  description: null,
  is_taxable: true,
  tax_exemption_limit: null,
  is_proof_required: false,
  consider_for_pf: false,
  consider_for_pt: false,
  consider_for_esi: false,
};

export const EarningForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      dialogType = "add",
    }: EarningFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const isEdit = dialogType === "edit";

    const isView = dialogType === "view";

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
      resolver: zodResolver(EarningFormSchema),
      mode: "all",
    });

    const isTaxable = watch("is_taxable");

    const calculationType = watch("calculation_type");

    useEnableDisableButton({
      control,
      defaultValues,
      errors,
    });

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
                  earning_component_type: true,
                  is_taxable: true,
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

    useMemo(() => {
      setValue("max_limit_per_year", null);
      clearErrors("max_limit_per_year");
    }, [calculationType]);

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    return (
      <Stack gap="16px">
        <FormRow maxColumn={2}>
          <RadioGroupField
            loading={loading}
            name="calculation_type"
            label="Calculation Type"
            control={control}
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

          <EarningComponentTypeAutocomplete
            control={control}
            loading={loading}
            error={!!errors.earning_component_type}
            helperText={errorMessages(errors.earning_component_type?.message)}
            name="earning_component_type"
            disabled={isEdit || isView}
            required
          />
        </FormRow>

        <FormRow maxColumn={2}>
          <TextField
            name="earning_component_code"
            control={control}
            loading={loading}
            label="Component Code"
            required
            disabled={isEdit || isView}
            error={!!errors.earning_component_code}
            helperText={errorMessages(errors.earning_component_code?.message)}
          />

          <TextField
            name="earning_component_name"
            control={control}
            loading={loading}
            label="Component Name"
            required
            error={!!errors.earning_component_name}
            helperText={errorMessages(errors.earning_component_name?.message)}
            disabled={isView}
          />
        </FormRow>

        {calculationType === "recurring" && (
          <FormRow maxColumn={2}>
            <TextField
              sx={{ maxWidth: "430px" }}
              name="max_limit_per_year"
              control={control}
              loading={loading}
              type="number"
              label="Maximum limit per year"
              error={!!errors.max_limit_per_year}
              helperText={errorMessages(errors.max_limit_per_year?.message)}
              disabled={isView}
            />
          </FormRow>
        )}

        <TextField
          name="description"
          control={control}
          loading={loading}
          label="Description"
          disabled={isView}
        />

        <RadioGroupField
          loading={loading}
          name="is_taxable"
          label="Is Component Taxable?"
          control={control}
          direction="column"
          sx={{
            alignItems: "flex-start ",
            "& .MuiFormControlLabel-label": {
              paddingTop: "6px",
            },
          }}
          options={[
            {
              values: true,
              label: "Yes(Taxable)",
              disabled: isView,
            },
            {
              label: (
                <Box>
                  <Stack gap="10px" alignItems="baseline">
                    <Typography variant="body1">
                      No(Exempted-Non Taxable)
                    </Typography>

                    {!isTaxable && (
                      <Stack direction="column" gap="10px">
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
                </Box>
              ),
              values: false,
              disabled: isView,
            },
          ]}
        />

        <Stack direction="row" gap="10px">
          <CheckBox
            name="consider_for_pf"
            loading={loading}
            control={control}
            size="small"
            disabled={isView}
          />

          <InputLabel>Consider for PF Contribution</InputLabel>
        </Stack>

        <Stack direction="row" gap="10px">
          <CheckBox
            name="consider_for_esi"
            loading={loading}
            control={control}
            size="small"
            disabled={isView}
          />

          <InputLabel>Consider for ESI Contribution</InputLabel>
        </Stack>

        <Stack direction="row" gap="10px">
          <CheckBox
            name="consider_for_pt"
            loading={loading}
            control={control}
            size="small"
            disabled={isView}
          />

          <InputLabel>Consider for PT Contribution</InputLabel>
        </Stack>
      </Stack>
    );
  }
);

EarningForm.displayName = "EarningForm";

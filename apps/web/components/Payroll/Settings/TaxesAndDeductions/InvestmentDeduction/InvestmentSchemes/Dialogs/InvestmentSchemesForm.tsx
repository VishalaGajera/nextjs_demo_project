import { CheckBox, FormRow, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../../hooks/useEnableDisableButton";
import {
  digitMaxLimit,
  filterChangedFormFields,
} from "../../../../../../../utils/helper";
import { holidayNameRegex } from "../../../../../../../utils/regex";
import { TaxSectionAutocomplete } from "../../../../../../common/Autocomplete/TaxSectionAutocomplete";

const InvestmentSchemesFormSchema = z
  .object({
    tax_section_id: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    scheme_code: z
      .string()
      .max(10)
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    scheme_name: z
      .string()
      .regex(holidayNameRegex, "common.noSpecialChar")
      .max(50)
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    description: z.string().max(250).nullable(),
    min_limit: z.number().min(0).nullable().optional(),
    max_limit: z.number().min(0).nullable().optional(),
    is_proof_required: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (Number(values.min_limit ?? 0) > Number(values.max_limit ?? 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_limit"],
        message: "Should be Equal or Greater than Min Limit.",
      });
    }

    if (values.max_limit && values.max_limit >= digitMaxLimit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("value.maximum.allowedLimit", {
          maxLimit: 999999999,
        }),
        path: ["max_limit"],
      });
    }

    if (values.min_limit && values.min_limit >= digitMaxLimit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("value.maximum.allowedLimit", {
          maxLimit: 999999999,
        }),
        path: ["min_limit"],
      });
    }
  });

export type InvestmentSchemesFormFieldValues = z.infer<
  typeof InvestmentSchemesFormSchema
>;

type InvestmentSchemesFormProps = {
  defaultValues?: InvestmentSchemesFormFieldValues;
  loading?: boolean;
  dialogType?: "add" | "edit" | "view";
  disabled?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<InvestmentSchemesFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<InvestmentSchemesFormFieldValues>;
};

const formDefaultValues: InvestmentSchemesFormFieldValues = {
  tax_section_id: null,
  scheme_code: null,
  scheme_name: null,
  description: null,
  min_limit: null,
  max_limit: null,
  is_proof_required: false,
};

export const InvestmentSchemesForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      dialogType = "add",
      disabled = false,
    }: InvestmentSchemesFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const isEdit = dialogType === "edit";

    const {
      control,
      setError,
      watch,
      trigger,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(InvestmentSchemesFormSchema),
      mode: "all",
    });

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(
            formValues,
            dirtyFields
          );

          onSubmit(filterFormValues);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const minLimit = watch("min_limit");

    const maxLimit = watch("max_limit");

    useMemo(() => {
      if (minLimit !== null) {
        trigger("min_limit");
      }

      if (maxLimit !== null) {
        trigger("max_limit");
      }
    }, [minLimit, maxLimit]);

    return (
      <Stack gap="35px">
        <FormRow maxColumn={2}>
          <TaxSectionAutocomplete
            name="tax_section_id"
            control={control}
            loading={loading}
            required
            error={!!errors.tax_section_id}
            helperText={errorMessages(errors.tax_section_id?.message)}
            disabled={isEdit || disabled}
          />

          <TextField
            name="scheme_code"
            control={control}
            label="Scheme Code"
            loading={loading}
            required
            error={!!errors.scheme_code}
            helperText={errorMessages(errors.scheme_code?.message)}
            disabled={isEdit || disabled}
          />
        </FormRow>

        <FormRow maxColumn={2}>
          <TextField
            name="scheme_name"
            control={control}
            label="Scheme Name"
            loading={loading}
            required
            error={!!errors.scheme_name}
            helperText={errorMessages(errors.scheme_name?.message)}
            disabled={disabled}
          />

          <TextField
            name="description"
            control={control}
            loading={loading}
            label="Description"
            multiline
            rows={4}
            error={!!errors.description}
            helperText={errorMessages(errors.description?.message)}
            disabled={disabled}
          />
        </FormRow>

        <FormRow maxColumn={2}>
          <TextField
            control={control}
            loading={loading}
            label="Minimum Limit"
            name="min_limit"
            type="number"
            error={!!errors.min_limit}
            helperText={errorMessages(errors.min_limit?.message)}
            disabled={disabled}
          />

          <TextField
            control={control}
            loading={loading}
            label="Maximum Limit"
            name="max_limit"
            type="number"
            error={!!errors.max_limit}
            helperText={errorMessages(errors.max_limit?.message)}
            disabled={disabled}
          />
        </FormRow>

        <Stack alignItems="start" flexDirection="row" gap="10px">
          <CheckBox
            name="is_proof_required"
            control={control}
            loading={loading}
            disabled={disabled}
          />

          <Typography variant="body1">
            Requires proof/bill attachment for tax exemption?
          </Typography>
        </Stack>
      </Stack>
    );
  }
);

InvestmentSchemesForm.displayName = "InvestmentSchemesForm";

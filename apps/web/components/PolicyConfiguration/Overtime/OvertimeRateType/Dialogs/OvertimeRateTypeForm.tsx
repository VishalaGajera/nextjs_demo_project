import { FormRow, RadioGroupField, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, Typography } from "@mui/material";
import type { ForwardedRef } from "react";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../hooks/useEnableDisableButton";
import { filterChangedFormFields } from "../../../../../utils/helper";
import { CompanyAutocomplete } from "../../../../common/Autocomplete/CompanyAutocomplete";

const OvertimeTypeSchema = z.enum(["custom_ot", "fixed_ot"]);

const OvertimeRateTypeSchema = z
  .object({
    company_id: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    overtime_rate_code: z
      .string()
      .max(255, "common.maxLength")
      .trim()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    overtime_rate_name: z
      .string()
      .max(255, "common.maxLength")
      .trim()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    description: z.string().max(255, "common.maxLength").nullable(),
    overtime_type: OvertimeTypeSchema,
    custom_ot: z.union([z.number().nullable(), z.string().nullable()]),
    fixed_ot: z.union([z.number().nullable(), z.string().nullable()]),
  })
  .superRefine((values, ctx) => {
    if (values.overtime_type === "custom_ot") {
      if (values.custom_ot === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["custom_ot"],
          message: "common.required",
        });
      } else if (Number(values.custom_ot) <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["custom_ot"],
          message: "Must be greater than 0.",
        });
      }
    }

    if (values.overtime_type === "fixed_ot") {
      if (values.fixed_ot === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fixed_ot"],
          message: "common.required",
        });
      } else if (Number(values.fixed_ot) <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fixed_ot"],
          message: "Must be greater than 0.",
        });
      }
    }
  });

export type OvertimeRateTypeFormFieldValues = z.infer<
  typeof OvertimeRateTypeSchema
>;

type OvertimeRateTypeFormProps = {
  defaultValues?: Partial<OvertimeRateTypeFormFieldValues>;
  loading?: boolean;
  disabled?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<OvertimeRateTypeFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<OvertimeRateTypeFormFieldValues>;
};

const formDefaultValues: OvertimeRateTypeFormFieldValues = {
  company_id: null,
  overtime_rate_code: null,
  overtime_rate_name: null,
  description: null,
  overtime_type: "custom_ot",
  custom_ot: null,
  fixed_ot: null,
};

export const OvertimeRateTypeForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
    }: OvertimeRateTypeFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      watch,
      control,
      setValue,
      clearErrors,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(OvertimeRateTypeSchema),
      mode: "all",
    });

    useEnableDisableButton({ control, defaultValues, errors });

    const { t } = useTranslation();

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(formValues, {
            ...dirtyFields,
            overtime_type: defaultValues.company_id
              ? dirtyFields.overtime_type
              : true,
            custom_ot:
              formValues.overtime_type !== "custom_ot"
                ? false
                : dirtyFields.custom_ot,
            fixed_ot:
              formValues.overtime_type !== "fixed_ot"
                ? false
                : dirtyFields.fixed_ot,
          });

          onSubmit(filterFormValues);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const overtimeType = watch("overtime_type");

    const fixed_ot = watch("fixed_ot");

    const custom_ot = watch("custom_ot");

    useEffect(() => {
      if (overtimeType === "custom_ot") {
        if (fixed_ot) {
          setValue("fixed_ot", "");
        }
        clearErrors("fixed_ot");
      } else if (overtimeType === "fixed_ot") {
        if (custom_ot) {
          setValue("custom_ot", "");
        }
        clearErrors("custom_ot");
      }
    }, [overtimeType]);

    return (
      <Stack gap="15px">
        <FormRow maxColumn={2}>
          <CompanyAutocomplete
            name="company_id"
            control={control}
            loading={loading}
            disabled={!!defaultValues.company_id || disabled}
            error={!!errors.company_id}
            helperText={errorMessages(errors.company_id?.message)}
            required
          />

          <TextField
            name="overtime_rate_code"
            control={control}
            label="Overtime Rate Code"
            loading={loading}
            disabled={!!defaultValues.overtime_rate_code || disabled}
            required
            error={!!errors.overtime_rate_code}
            helperText={errorMessages(errors.overtime_rate_code?.message)}
          />
        </FormRow>

        <FormRow maxColumn={2}>
          <TextField
            name="overtime_rate_name"
            control={control}
            label="Overtime Rate Name"
            loading={loading}
            required
            error={!!errors.overtime_rate_name}
            helperText={errorMessages(errors.overtime_rate_name?.message)}
            disabled={disabled}
          />

          <TextField
            loading={loading}
            name="description"
            control={control}
            label="Description"
            disabled={disabled}
          />
        </FormRow>

        <Typography variant="h6">Calculation Type</Typography>

        <RadioGroupField
          name="overtime_type"
          control={control}
          loading={loading}
          direction="column"
          label=""
          sx={{
            alignItems: "flex-start ",
          }}
          options={[
            {
              label: (
                <Stack gap="10px" alignItems="baseline" direction="row">
                  <Typography variant="body1">
                    For Every OT hour worked, the employee is paid
                  </Typography>
                  <TextField
                    sx={{ maxWidth: "250px" }}
                    type="number"
                    name="custom_ot"
                    control={control}
                    label=""
                    loading={loading}
                    disabled={overtimeType != "custom_ot"}
                    error={!!errors.custom_ot}
                    helperText={errorMessages(errors.custom_ot?.message)}
                  />
                  <Typography variant="body1">
                    Times their hourly rate.
                  </Typography>
                </Stack>
              ),
              values: "custom_ot",
              disabled: disabled || false,
            },
            {
              label: (
                <Stack gap="10px" alignItems="baseline" direction="row">
                  <Typography variant="body1">A Fixed amount of</Typography>
                  <TextField
                    sx={{ maxWidth: "250px" }}
                    type="number"
                    name="fixed_ot"
                    control={control}
                    label=""
                    loading={loading}
                    disabled={overtimeType != "fixed_ot"}
                    error={!!errors.fixed_ot}
                    helperText={errorMessages(errors.fixed_ot?.message)}
                  />
                  <Typography variant="body1">
                    is paid for each OT hours.
                  </Typography>
                </Stack>
              ),
              values: "fixed_ot",
              disabled: disabled || false,
            },
          ]}
        />
        <FormRow maxColumn={1}></FormRow>
      </Stack>
    );
  }
);

OvertimeRateTypeForm.displayName = "OvertimeRateTypeForm";

import { FormRow, RadioGroupField, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, Typography, useTheme } from "@mui/material";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../hooks/useEnableDisableButton";
import { filterChangedFormFields } from "../../../../utils/helper";
import { uppercaseLettersRegex } from "../../../../utils/regex";
import { CompanyAutocomplete } from "../../../common/Autocomplete/CompanyAutocomplete";

//TODO:Bhavik, define common message
const EmployeeCodeSchema = z.object({
  company_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  employee_code_name: z
    .string()
    .max(255, "common.maxLength")
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  series_start: z
    .number()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  is_active: z.boolean().nullable(),
  prefix: z
    .string()
    .regex(uppercaseLettersRegex, "common.uppercase.letters.invalid")
    .max(5, "common.max5Length")
    .nullable(),
  suffix: z
    .string()
    .regex(uppercaseLettersRegex, "common.uppercase.letters.invalid")
    .max(5, "common.max5Length")
    .nullable(),
});

export type EmployeeCodeFormFieldValues = z.infer<typeof EmployeeCodeSchema>;

type EmployeeCodeFormProps = {
  defaultValues?: EmployeeCodeFormFieldValues;
  loading?: boolean;
  disabled?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<EmployeeCodeFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<EmployeeCodeFormFieldValues>;
};

const formDefaultValues: EmployeeCodeFormFieldValues = {
  company_id: null,
  employee_code_name: null,
  series_start: null,
  is_active: true,
  prefix: null,
  suffix: null,
};

export const EmployeeCodeForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
    }: EmployeeCodeFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const theme = useTheme();

    const { slate } = theme.palette.app.color;

    const {
      watch,
      control,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(EmployeeCodeSchema),
      mode: "all",
    });

    useEnableDisableButton({ control, defaultValues, errors });

    const prefix = watch("prefix");

    const series_start = watch("series_start");

    const suffix = watch("suffix");

    const { t } = useTranslation();

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

    return (
      <Stack gap="15px">
        <FormRow maxColumn={2}>
          <CompanyAutocomplete
            name="company_id"
            label="Company"
            control={control}
            queryParams={{
              only_auto_generated: true,
            }}
            placeholder="Select Company"
            loading={loading}
            disabled={!!defaultValues.company_id || disabled}
            error={!!errors.company_id}
            helperText={errorMessages(errors.company_id?.message)}
            required
          />

          <TextField
            name="employee_code_name"
            control={control}
            label="Name"
            loading={loading}
            required
            error={!!errors.employee_code_name}
            helperText={errorMessages(errors.employee_code_name?.message)}
            disabled={disabled}
          />
        </FormRow>

        <FormRow maxColumn={2}>
          <RadioGroupField
            name="is_active"
            label="Active"
            control={control}
            loading={loading}
            options={[
              {
                values: true,
                label: "Yes",
                disabled: disabled ? true : false,
              },
              {
                values: false,
                label: "No",
                disabled: disabled ? true : false,
              },
            ]}
          />
        </FormRow>

        <Typography variant="h6" color={slate[900]}>
          Employee Code Format
        </Typography>

        <FormRow maxColumn={2}>
          <TextField
            control={control}
            label="Prefix"
            name="prefix"
            loading={loading}
            error={!!errors.prefix}
            helperText={errorMessages(errors.prefix?.message)}
            disabled={disabled}
          />

          <TextField
            control={control}
            label="Series Start"
            name="series_start"
            type="number"
            loading={loading}
            required
            error={!!errors.series_start}
            helperText={errorMessages(errors.series_start?.message)}
            disabled={disabled}
          />
        </FormRow>

        <FormRow maxColumn={2}>
          <TextField
            control={control}
            label="Suffix"
            name="suffix"
            loading={loading}
            error={!!errors.suffix}
            helperText={errorMessages(errors.suffix?.message)}
            disabled={disabled}
          />
        </FormRow>

        <Typography variant="h6" color={slate[900]}>
          Sample Employee Code :{" "}
          {series_start
            ? `${prefix ?? ""}${series_start ?? ""}${suffix ?? ""}`
            : "-"}
        </Typography>
      </Stack>
    );
  }
);

EmployeeCodeForm.displayName = "EmployeeCodeForm";

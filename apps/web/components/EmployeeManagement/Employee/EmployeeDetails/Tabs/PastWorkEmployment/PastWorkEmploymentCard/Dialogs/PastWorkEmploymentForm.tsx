import { DatePicker, FormRow, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skeleton, Stack, Typography, useTheme } from "@mui/material";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../../../hooks/useEnableDisableButton";
import { calculateDateDifference } from "../../../../../../../../utils/date";
import { filterChangedFormFields } from "../../../../../../../../utils/helper";

const PastWorkEmploymentSchema = z.object({
  company_name: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  from_date: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  to_date: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  designation: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  address: z.string().trim().optional().nullable(),
  leaving_reason: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type PastWorkEmploymentSchemaFormFieldValues = z.infer<
  typeof PastWorkEmploymentSchema
>;

type PastWorkEmploymentFormProps = {
  defaultValues?: PastWorkEmploymentSchemaFormFieldValues;
  loading?: boolean;
  employeeId?: string;
  disabled?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (
      formValues: Partial<PastWorkEmploymentSchemaFormFieldValues>
    ) => void
  ) => void;
  setError: UseFormSetError<PastWorkEmploymentSchemaFormFieldValues>;
};

const formDefaultValues: PastWorkEmploymentSchemaFormFieldValues = {
  company_name: null,
  from_date: null,
  to_date: null,
  designation: null,
  address: null,
  leaving_reason: null,
};

export const PastWorkEmploymentForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
    }: PastWorkEmploymentFormProps,
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
      resolver: zodResolver(PastWorkEmploymentSchema),
      mode: "all",
    });

    useEnableDisableButton({ control, defaultValues, errors });

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

    const fromDate = watch("from_date");

    const toDate = watch("to_date");

    return (
      <Stack gap="15px">
        <FormRow maxColumn={2}>
          <TextField
            control={control}
            label="Company Name"
            name="company_name"
            loading={loading}
            required
            error={!!errors.company_name}
            helperText={errorMessages(errors.company_name?.message)}
            disabled={disabled}
          />

          <TextField
            control={control}
            label="Designation"
            name="designation"
            loading={loading}
            required
            error={!!errors.designation}
            helperText={errorMessages(errors.designation?.message)}
            disabled={disabled}
          />
        </FormRow>
        <FormRow maxColumn={2}>
          <TextField
            control={control}
            label="Address"
            name="address"
            loading={loading}
            error={!!errors.address}
            helperText={errorMessages(errors.address?.message)}
            disabled={disabled}
          />

          <TextField
            control={control}
            label="Leaving reason"
            name="leaving_reason"
            loading={loading}
            required
            error={!!errors.leaving_reason}
            helperText={errorMessages(errors.leaving_reason?.message)}
            disabled={disabled}
          />
        </FormRow>

        <FormRow maxColumn={2}>
          <DatePicker
            loading={loading}
            name="from_date"
            control={control}
            label="From date"
            setError={setError}
            maxDate={toDate ? DateTime.fromISO(toDate) : DateTime.now()}
            required
            error={!!errors.from_date}
            helperText={errorMessages(errors.from_date?.message)}
            disabled={disabled}
          />

          <DatePicker
            loading={loading}
            name="to_date"
            control={control}
            label="To date"
            setError={setError}
            minDate={fromDate ? DateTime.fromISO(fromDate) : undefined} // The minimum date allowed is 'fromDate'
            maxDate={DateTime.now()} // The maximum date allowed is 'now'
            required
            error={!!errors.to_date}
            helperText={errorMessages(errors.to_date?.message)}
            disabled={disabled}
          />
        </FormRow>

        {loading ? (
          <Skeleton
            width={300}
            height="30px"
            sx={{
              transform: "scale(1)",
            }}
          />
        ) : (
          <Typography variant="h6" color={slate[900]}>
            Experience :
            {fromDate && toDate && calculateDateDifference(fromDate, toDate)}
          </Typography>
        )}
      </Stack>
    );
  }
);

PastWorkEmploymentForm.displayName = "PastWorkEmploymentForm";

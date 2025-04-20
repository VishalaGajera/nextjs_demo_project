import { DatePicker, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../hooks/useEnableDisableButton";
import { filterChangedFormFields } from "../../../../../../utils/helper";

const HolidayFormSchema = z.object({
  holiday_date: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  holiday_name: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type HolidayFormFieldValues = z.infer<typeof HolidayFormSchema>;

type HolidayFormProps = {
  defaultValues?: HolidayFormFieldValues;
  loading?: boolean;
  year?: string;
  isPreDefinedHoliday?: boolean;
  disabled?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<HolidayFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<HolidayFormFieldValues>;
};

const formDefaultValues: HolidayFormFieldValues = {
  holiday_date: null,
  holiday_name: null,
};

export const HolidayForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      year,
      isPreDefinedHoliday = true,
      disabled = false,
    }: HolidayFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const minDate = DateTime.fromObject({
      year: Number(year),
      month: 1,
      day: 1,
    });

    const maxDate = DateTime.fromObject({
      year: Number(year),
      month: 12,
      day: 31,
    });

    const {
      control,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(HolidayFormSchema),
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

    return (
      <Stack gap="20px">
        <TextField
          name="holiday_name"
          control={control}
          loading={loading}
          label="Holiday Name"
          required
          error={!!errors.holiday_name}
          helperText={errorMessages(errors.holiday_name?.message)}
          placeholder="Enter Holiday  Name"
          disabled={disabled}
        />
        <DatePicker
          name="holiday_date"
          control={control}
          label="Holiday Date"
          setError={setError}
          disabled={!isPreDefinedHoliday || disabled}
          loading={loading}
          minDate={minDate}
          maxDate={maxDate}
          required
          error={!!errors.holiday_date}
          helperText={errorMessages(errors.holiday_date?.message)}
        />
      </Stack>
    );
  }
);

HolidayForm.displayName = "HolidayForm";

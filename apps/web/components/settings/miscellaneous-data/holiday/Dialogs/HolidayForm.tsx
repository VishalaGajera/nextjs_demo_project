import {
  CheckBox,
  DatePicker,
  FormRow,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputLabel, Stack } from "@mui/material";
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
import { useEnableDisableButton } from "../../../../../hooks/useEnableDisableButton";
import { filterChangedFormFields } from "../../../../../utils/helper";
import { holidayNameRegex } from "../../../../../utils/regex";

const HolidayFormSchema = z.object({
  holiday_name: z
    .string()
    .regex(holidayNameRegex, "common.noSpecialChar")
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  holiday_date: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  description: z.string().max(255, "common.maxLength").nullable(),
  is_recommended: z.boolean().nullable(),
});

export type HolidayFormFieldValues = z.infer<typeof HolidayFormSchema>;

export type HolidayFormProps = {
  defaultValues?: Partial<HolidayFormFieldValues>;
  loading?: boolean;
  disabled?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<HolidayFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<HolidayFormFieldValues>;
};

const formDefaultValues: HolidayFormFieldValues = {
  holiday_name: null,
  holiday_date: null,
  description: null,
  is_recommended: null,
};

export const HolidayForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
    }: HolidayFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const initialValues = useMemo(() => {
      return { ...formDefaultValues, ...defaultValues };
    }, [defaultValues]);

    const {
      control,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: initialValues,
      resolver: zodResolver(HolidayFormSchema),
      mode: "all",
    });

    useEnableDisableButton({
      control,
      defaultValues: initialValues,
      errors,
    });

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
      <Stack gap="16px">
        <FormRow maxColumn={2}>
          <TextField
            name="holiday_name"
            control={control}
            label="Holiday Name"
            required
            loading={loading}
            error={!!errors.holiday_name}
            helperText={errorMessages(errors.holiday_name?.message)}
            disabled={disabled}
          />

          <DatePicker
            name="holiday_date"
            control={control}
            loading={loading}
            label="Holiday Date"
            required
            error={!!errors.holiday_date}
            helperText={errorMessages(errors.holiday_date?.message)}
            disabled={disabled}
          />
        </FormRow>

        <TextField
          name="description"
          control={control}
          label="Description"
          loading={loading}
          error={!!errors.description}
          helperText={errorMessages(errors.description?.message)}
          disabled={disabled}
        />
        <Stack direction="row" gap="10px" alignItems="center">
          <CheckBox
            loading={loading}
            name="is_recommended"
            control={control}
            disabled={disabled}
          />
          <InputLabel>Is Recommended?</InputLabel>
        </Stack>
      </Stack>
    );
  }
);

HolidayForm.displayName = "HolidayForm";

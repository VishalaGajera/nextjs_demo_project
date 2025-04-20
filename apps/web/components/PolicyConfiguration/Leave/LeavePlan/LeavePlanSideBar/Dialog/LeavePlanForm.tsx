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
import { CompanyAutocomplete } from "../../../../../common/Autocomplete/CompanyAutocomplete";
import type { LeavePlanPayload } from "./hooks/useAddLeavePlan";

const LeavePlanFormSchema = z.object({
  company_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  leave_plan_name: z
    .string()
    .min(3, { message: "leave plan name should be more than 3 characters" })
    .max(20, { message: "leave plan name can`t be more than 20 characters" })
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  year_start_month: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  description: z
    .string()
    .max(200, { message: "description can`t be more than 200 characters" })
    .optional()
    .nullable(),
});

export type LeavePlanFormFieldValues = z.infer<typeof LeavePlanFormSchema>;

type LeavePlanFormProps = {
  defaultValues?: LeavePlanFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<LeavePlanPayload>) => void
  ) => void;
  setError: UseFormSetError<LeavePlanFormFieldValues>;
};

const formDefaultValues: LeavePlanFormFieldValues = {
  company_id: null,
  leave_plan_name: null,
  year_start_month: null,
  description: null,
};

export const LeavePlanForm = forwardRef(
  (
    { defaultValues = formDefaultValues, loading = false }: LeavePlanFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const {
      control,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(LeavePlanFormSchema),
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

          const leavePlanMonth =
            filterFormValues.year_start_month &&
            DateTime.fromISO(filterFormValues.year_start_month).toFormat("MM");

          const leavePlanYear =
            filterFormValues.year_start_month &&
            DateTime.fromISO(filterFormValues.year_start_month).toFormat(
              "yyyy"
            );

          if (dirtyFields.year_start_month) {
            const leavePlanPayload = {
              ...filterFormValues,
              year_start_month: Number(leavePlanMonth),
              start_year: Number(leavePlanYear),
            };

            onSubmit(leavePlanPayload);
          } else {
            onSubmit(filterFormValues);
          }
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    return (
      <Stack gap="20px">
        <CompanyAutocomplete
          name="company_id"
          control={control}
          required
          error={!!errors.company_id}
          helperText={errorMessages(errors.company_id?.message)}
          loading={loading}
          disabled={!!defaultValues.company_id}
        />

        <TextField
          label="Leave Plan Name"
          name="leave_plan_name"
          control={control}
          required
          error={!!errors.leave_plan_name}
          helperText={errorMessages(errors.leave_plan_name?.message)}
          loading={loading}
        />

        <DatePicker
          name="year_start_month"
          control={control}
          openTo="month"
          views={["month", "year"]}
          label="Leave calendar year"
          format="MMM yyyy"
          required
          error={!!errors.year_start_month}
          helperText={errorMessages(errors.year_start_month?.message)}
          loading={loading}
          disabled={!!defaultValues.year_start_month}
        />

        <TextField
          label="Description"
          name="description"
          control={control}
          multiline
          minRows={2}
          maxRows={2}
          error={!!errors.description}
          helperText={errorMessages(errors.description?.message)}
          loading={loading}
        />
      </Stack>
    );
  }
);

LeavePlanForm.displayName = "LeavePlanForm";

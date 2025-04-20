import {
  formatDate,
  FormRow,
  getTimeInHHmm,
  TextField,
  TimeField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../../hooks/useEnableDisableButton";
import { filterChangedFormFields } from "../../../../../../../utils/helper";
import { CompanyAutocomplete } from "../../../../../../common/Autocomplete/CompanyAutocomplete";
import { BankShiftTimingForm } from "./BankShiftTimingFrom";

const BankShiftFormSchema = z
  .object({
    company_id: z
      .string()
      .nullable()
      .refine((value) => !!value, { message: "common.required" }),
    bank_shift_type_name: z
      .string()
      .max(50, "common.maxNameLength")
      .nullable()
      .refine((value) => !!value, { message: "common.required" }),
    bank_shift_type_code: z
      .string()
      .max(10, "common.maxCodeLength")
      .nullable()
      .refine((value) => !!value, { message: "common.required" }),
    description: z.string().max(255, "common.maxLength").nullable(),
    punch_difference_minutes: z.string().nullable().optional(),
    shift_start: z
      .string()
      .nullable()
      .refine((value) => !!value, { message: "common.required" })
      .refine(
        (value) => {
          if (!value) {
            return false;
          }

          return DateTime.fromISO(value).isValid;
        },
        { message: "common.invalidTime" }
      ),
    shift_end: z
      .string()
      .nullable()
      .refine((value) => !!value, { message: "common.required" }),
    shift_hours: z
      .string()
      .nullable()
      .refine((value) => !!value, { message: "common.required" })
      .refine(
        (value) => {
          if (!value) {
            return false;
          }

          return DateTime.fromISO(value).isValid;
        },
        { message: "common.invalidTime" }
      ),
    break_start: z
      .string()
      .nullable()
      .optional()
      .refine((value) => !value || DateTime.fromISO(value).isValid, {
        message: "common.invalidTime",
      }),

    break_end: z
      .string()
      .nullable()
      .optional()
      .refine((value) => !value || DateTime.fromISO(value).isValid, {
        message: "common.invalidTime",
      }),
    break_hours: z.string().nullable(),
  })
  // eslint-disable-next-line sonarjs/cognitive-complexity
  .superRefine((data, ctx) => {
    if (data) {
      if (data.break_start && !data.break_end) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["break_end"],
          message: "common.required",
        });
      }

      if (data.shift_start && data.shift_end && data.break_start) {
        const start = getTimeInHHmm(data.shift_start);

        const end = getTimeInHHmm(data.shift_end);

        const breakStartTime = getTimeInHHmm(data.break_start);

        if (end > start) {
          const isBreakStartInRange =
            breakStartTime > start && breakStartTime < end;

          if (!isBreakStartInRange) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["break_start"],
              message:
                "Break from time cannot be earlier than the shift from time or later than the shift to time. Please enter a valid break time.",
            });
          }
        }

        if (end < start) {
          const isBreakStartInNightRange =
            breakStartTime < start && breakStartTime > end;

          if (isBreakStartInNightRange) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["break_start"],
              message:
                "Break from time cannot be earlier than the shift from time or later than the shift to time. Please enter a valid break time.",
            });
          }
        }
      }

      if (data.shift_end && data.break_start && data.break_end) {
        const start = getTimeInHHmm(data.break_start);

        const end = getTimeInHHmm(data.shift_end);

        const breakEndTime = getTimeInHHmm(data.break_end);

        if (end > start) {
          const isBreakEndInRange = breakEndTime > start && breakEndTime < end;

          if (!isBreakEndInRange) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["break_end"],
              message:
                "Break to time must be after Break from time and before Shift To time. Please enter a valid break time.",
            });
          }
        }

        if (end < start) {
          const isBreakEndInNightRange =
            breakEndTime < start && breakEndTime > end;

          if (isBreakEndInNightRange) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["break_end"],
              message:
                "Break to time must be after Break from time and before Shift To time. Please enter a valid break time.",
            });
          }
        }
      }
    }
  });

export type BankShiftFormFieldValues = z.infer<typeof BankShiftFormSchema>;

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<BankShiftFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<BankShiftFormFieldValues>;
};

type BankShiftFormProps = {
  defaultValues?: BankShiftFormFieldValues;
  loading?: boolean;
  disabled?: boolean;
};

const formDefaultValues: BankShiftFormFieldValues = {
  company_id: null,
  bank_shift_type_name: null,
  bank_shift_type_code: null,
  punch_difference_minutes: null,
  description: null,
  shift_start: null,
  shift_hours: null,
  shift_end: null,
  break_start: null,
  break_end: null,
  break_hours: null,
};

export const BankShiftForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
    }: BankShiftFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const methods = useForm({
      values: defaultValues,
      resolver: zodResolver(BankShiftFormSchema),
      mode: "all",
    });

    const {
      control,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = methods;

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(
            formValues,
            dirtyFields
          );

          const payload = {
            ...filterFormValues,
            ...(filterFormValues.punch_difference_minutes && {
              punch_difference_minutes: formatDate(
                filterFormValues.punch_difference_minutes,
                "HH:mm:ss"
              ),
            }),
          };

          onSubmit(payload);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => messageKey && t(messageKey);

    return (
      <Stack gap="10px">
        <FormProvider {...methods}>
          <Stack gap="10px">
            <FormRow>
              <CompanyAutocomplete
                loading={loading}
                control={control}
                disabled={!!defaultValues.company_id || disabled}
                error={!!errors.company_id}
                helperText={errorMessages(errors.company_id?.message)}
                name="company_id"
                required
              />
            </FormRow>

            <FormRow>
              <TextField
                label="Bank Shift Code"
                name="bank_shift_type_code"
                loading={loading}
                control={control}
                disabled={!!defaultValues.bank_shift_type_code || disabled}
                required
                error={!!errors.bank_shift_type_code}
                helperText={errorMessages(errors.bank_shift_type_code?.message)}
              />

              <TextField
                label="Bank Shift Name"
                name="bank_shift_type_name"
                loading={loading}
                control={control}
                required
                error={!!errors.bank_shift_type_name}
                helperText={errorMessages(errors.bank_shift_type_name?.message)}
                disabled={disabled}
              />

              <TextField
                loading={loading}
                control={control}
                name="description"
                label="Description"
                disabled={disabled}
              />
            </FormRow>
          </Stack>

          <BankShiftTimingForm loading={loading} disabled={disabled} />

          <FormRow>
            <TimeField
              loading={loading}
              control={control}
              ampm={false}
              name="punch_difference_minutes"
              label="Punch Difference Minutes"
              isReturnLocalTime
              error={!!errors.punch_difference_minutes}
              helperText={errorMessages(
                errors.punch_difference_minutes?.message
              )}
              disabled={disabled}
            />
          </FormRow>
        </FormProvider>
      </Stack>
    );
  }
);

BankShiftForm.displayName = "BankShiftForm";

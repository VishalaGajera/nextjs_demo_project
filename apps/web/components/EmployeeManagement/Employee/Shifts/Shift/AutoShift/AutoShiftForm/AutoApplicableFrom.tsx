import { FormRow, RadioGroupField, TimeField } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { DateTime } from "luxon";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import type { AutoShiftFormFieldValues, ShiftFormProps } from "./AutoShiftForm";

export const applicableCriteriaSchema = z.object({
  grace_in_minutes: z
    .string()
    .nullable()
    .optional()
    .refine(
      (value) => {
        if (!value) {
          return true;
        }

        return DateTime.fromISO(value).isValid;
      },
      { message: "common.invalidTime" }
    ),

  grace_out_minutes: z
    .string()
    .nullable()
    .optional()
    .refine(
      (value) => {
        if (!value) {
          return true;
        }

        return DateTime.fromISO(value).isValid;
      },
      { message: "common.invalidTime" }
    ),

  min_half_day_hours: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    })
    .refine(
      (value) => {
        if (!value) {
          return false;
        }

        return DateTime.fromISO(value).isValid;
      },
      { message: "common.invalidTime" }
    ),
  min_full_day_hours: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    })
    .refine(
      (value) => {
        if (!value) {
          return false;
        }

        return DateTime.fromISO(value).isValid;
      },
      { message: "common.invalidTime" }
    ),
  hours_calculation_method: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export const AutoApplicableFrom = ({
  loading,
  disabled = false,
}: ShiftFormProps) => {
  const { t } = useTranslation();

  const {
    control,
    formState: { errors },
  } = useFormContext<AutoShiftFormFieldValues>();

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const {
    grace_in_minutes,
    grace_out_minutes,
    min_half_day_hours,
    min_full_day_hours,
  } = errors.applicable_criteria ?? {};

  return (
    <Stack gap="10px">
      <FormRow maxColumn={3}>
        <TimeField
          control={control}
          loading={loading}
          name="applicable_criteria.grace_in_minutes"
          label="Grace In(Minutes)"
          isReturnLocalTime
          error={!!grace_in_minutes}
          helperText={errorMessages(grace_in_minutes?.message)}
          disabled={disabled}
        />

        <TimeField
          control={control}
          loading={loading}
          name="applicable_criteria.grace_out_minutes"
          label="Grace Out(Minutes)"
          isReturnLocalTime
          error={!!grace_out_minutes}
          helperText={errorMessages(grace_out_minutes?.message)}
          disabled={disabled}
        />

        <TimeField
          control={control}
          loading={loading}
          name="applicable_criteria.min_half_day_hours"
          label="Half Day (Minimum Hours)"
          isReturnLocalTime
          error={!!min_half_day_hours}
          helperText={errorMessages(min_half_day_hours?.message)}
          disabled={disabled}
          required
        />
      </FormRow>

      <FormRow maxColumn={3}>
        <TimeField
          control={control}
          loading={loading}
          name="applicable_criteria.min_full_day_hours"
          label="Full Day (Minimum Hours)"
          isReturnLocalTime
          error={!!min_full_day_hours}
          helperText={errorMessages(min_full_day_hours?.message)}
          disabled={disabled}
          required
        />
      </FormRow>

      <FormRow maxColumn={2}>
        <RadioGroupField
          loading={loading}
          name="applicable_criteria.hours_calculation_method"
          label="Total hours Calculation :"
          size="medium"
          control={control}
          options={[
            {
              values: "first_in_last_out",
              label: "First Clock-in & Last Clock-Out",
              disabled: disabled || false,
            },
            {
              values: "clock_in_clock_out",
              label: "Every Valid Clock-In & Clock-Out",
              disabled: disabled || false,
            },
          ]}
        />
      </FormRow>
    </Stack>
  );
};

import { getTimeInHHmm, TimePicker } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import {
  getTimeDifference,
  getTimeHhMmSs,
} from "../../../../../../../utils/date";
import { calculateNetWorkingHours } from "../../FixedShift/AddFixedShift/FixedShiftTimingRow";
import type { AutoShiftFormFieldValues, ShiftFormProps } from "./AutoShiftForm";

export const defaultShiftTimingsSchema = z
  .object({
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
    shift_hours: z.string().nullable(),
    break_start: z.string().nullable().optional(),
    break_end: z.string().nullable().optional(),
    break_hours: z.string().nullable(),
  })
  // eslint-disable-next-line sonarjs/cognitive-complexity
  .superRefine((data, ctx) => {
    if (data) {
      //  shift in & end
      const shiftStartInHhMm =
        data.shift_start && getTimeInHHmm(data.shift_start);

      const shiftEndInHhMm = data.shift_end && getTimeInHHmm(data.shift_end);

      const breakStartInHhMm =
        data.break_start && getTimeInHHmm(data.break_start);

      const breakEndInHhMm = data.break_end && getTimeInHHmm(data.break_end);

      //  break in
      if (shiftStartInHhMm && shiftEndInHhMm && breakStartInHhMm) {
        const isBreakStartInRange =
          breakStartInHhMm > shiftStartInHhMm &&
          breakStartInHhMm < shiftEndInHhMm;

        if (!isBreakStartInRange) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["break_start"],
            message:
              "Break from time must be between shift from and shift to time",
          });
        }
      }

      //  break end
      if (breakEndInHhMm && breakStartInHhMm && shiftEndInHhMm) {
        const isBreakEndInRange =
          breakEndInHhMm > breakStartInHhMm && breakEndInHhMm < shiftEndInHhMm;

        if (!isBreakEndInRange) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["break_end"],
            message:
              "Break to time must be after 'Break From' and before 'Shift To' time",
          });
        }
      }

      if (breakStartInHhMm && !breakEndInHhMm) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["break_end"],
          message:
            "Break end time is required when break start time is provided",
        });
      }
    }
  });

export const AutoShiftDefaultTimingRow = ({
  loading,
  disabled = false,
}: ShiftFormProps) => {
  const { t } = useTranslation();

  const {
    watch,
    formState: { errors },
    setValue,
    resetField,
    setError,
    clearErrors,
    control,
  } = useFormContext<AutoShiftFormFieldValues>();

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const shiftStart = watch("default_shift_timing.shift_start") ?? "";

  const shiftEnd = watch("default_shift_timing.shift_end") ?? "";

  const breakStart = watch("default_shift_timing.break_start") ?? "";

  const breakEnd = watch("default_shift_timing.break_end") ?? "";

  const shiftHoursHhMmSs = getTimeHhMmSs({
    start: shiftStart,
    end: shiftEnd,
  });

  const breakHoursHhMmSs = getTimeHhMmSs({
    start: breakStart,
    end: breakEnd,
  });

  const shiftHours = getTimeDifference({
    start: shiftStart,
    end: shiftEnd,
  }).textFormat;

  const breakHours = getTimeDifference({
    start: breakStart,
    end: breakEnd,
  }).textFormat;

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    const shiftInStartInHhMm = shiftStart && getTimeInHHmm(shiftStart);

    const shiftInEndInHhMm = shiftEnd && getTimeInHHmm(shiftEnd);

    const breakInStartInHhMm = breakStart && getTimeInHHmm(breakStart);

    const breakInEndInHhMm = breakEnd && getTimeInHHmm(breakEnd);

    if (shiftInStartInHhMm && shiftInEndInHhMm && breakInStartInHhMm) {
      const isBreakStartInRange =
        breakInStartInHhMm > shiftInStartInHhMm &&
        breakInStartInHhMm < shiftInEndInHhMm;

      if (!isBreakStartInRange) {
        setError("default_shift_timing.break_start", {
          type: "custom",
          message:
            "Break from time must be between shift from and shift to time",
        });
      } else {
        clearErrors("default_shift_timing.break_start");
      }
    }

    if (shiftInEndInHhMm && breakInStartInHhMm && breakInEndInHhMm) {
      const isBreakEndInRange =
        breakInEndInHhMm > breakInStartInHhMm &&
        breakInEndInHhMm < shiftInEndInHhMm;

      if (!isBreakEndInRange) {
        setError("default_shift_timing.break_end", {
          type: "custom",
          message:
            "Break to time must be after 'Break From' and before 'Shift To' time",
        });
      } else {
        clearErrors("default_shift_timing.break_end");
      }
    }

    if (breakInStartInHhMm && !breakInEndInHhMm) {
      setError("default_shift_timing.break_end", {
        type: "custom",
        message: "Break end time is required when break start time is provided",
      });
    } else {
      clearErrors("default_shift_timing.break_end");
    }

    if (shiftStart && shiftEnd) {
      setValue("default_shift_timing.shift_hours", shiftHoursHhMmSs);
    }

    if (breakStart && breakEnd) {
      setValue("default_shift_timing.break_hours", breakHoursHhMmSs);
    }

    if ((!breakStart.length && breakEnd) || !shiftStart || !shiftEnd) {
      resetField("default_shift_timing.break_end");
      resetField("default_shift_timing.break_hours");
      resetField("default_shift_timing.break_start");
    }
  }, [shiftStart, shiftEnd, breakStart, breakEnd]);

  return (
    <Stack direction="row" sx={{ minWidth: "100%" }} gap="10px">
      <Box width="100%" maxWidth="250px">
        <TimePicker
          loading={loading}
          control={control}
          name="default_shift_timing.shift_start"
          error={!!errors?.default_shift_timing?.shift_start}
          helperText={errorMessages(
            errors?.default_shift_timing?.shift_start?.message
          )}
          disabled={disabled}
        />
      </Box>

      <Box width="100%" maxWidth="250px">
        <TimePicker
          loading={loading}
          control={control}
          name="default_shift_timing.shift_end"
          error={!!errors.default_shift_timing?.shift_end}
          helperText={errorMessages(
            errors?.default_shift_timing?.shift_end?.message
          )}
          disabled={disabled}
        />
      </Box>

      <Typography mt="10px" sx={{ width: "100%", maxWidth: "250px" }}>
        {shiftStart && shiftEnd ? shiftHours : "0h 0m"}
      </Typography>

      <Box width="100%" maxWidth="250px">
        <TimePicker
          loading={loading}
          control={control}
          name="default_shift_timing.break_start"
          error={!!errors.default_shift_timing?.break_start}
          helperText={errorMessages(
            errors?.default_shift_timing?.break_start?.message
          )}
          disabled={!(shiftStart && shiftEnd) || disabled}
        />
      </Box>

      <Box width="100%" maxWidth="250px">
        <TimePicker
          loading={loading}
          control={control}
          name="default_shift_timing.break_end"
          error={!!errors.default_shift_timing?.break_end}
          helperText={errorMessages(
            errors?.default_shift_timing?.break_end?.message
          )}
          disabled={!breakStart || disabled}
        />
      </Box>

      <Typography mt="10px" sx={{ width: "100%", maxWidth: "250px" }}>
        {breakStart && breakEnd ? breakHours : "0h 0m"}
      </Typography>

      <Typography mt="10px" sx={{ width: "100%", maxWidth: "250px" }}>
        {calculateNetWorkingHours(shiftStart, shiftEnd, breakStart, breakEnd)}
      </Typography>
    </Stack>
  );
};

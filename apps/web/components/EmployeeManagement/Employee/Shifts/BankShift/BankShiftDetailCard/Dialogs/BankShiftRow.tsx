import { getDifferenceInHHmmss, TimePicker } from "@codezee/sixtify-brahma";
import { Box, Grid, Skeleton, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getTimeDifference } from "../../../../../../../utils/date";
import {
  calculateNetWorkingHours,
  shouldDisableBreakEndTime,
  shouldDisableBreakStartTime,
} from "../../../Shift/FixedShift/AddFixedShift/FixedShiftTimingRow";
import type { BankShiftFormFieldValues, DayOfWeek } from "./BankShiftForm";

type BankShiftRowProps = {
  day: DayOfWeek;
  loading?: boolean;
  disabled?: boolean;
};

export const getDuration = (start: string, end: string) => {
  const startTime = DateTime.fromISO(start);

  const endTime = DateTime.fromISO(end);

  return endTime.diff(startTime, ["hours", "minutes"]);
};

export const BankShiftRow = ({
  day,
  loading = false,
  disabled = false,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}: BankShiftRowProps) => {
  const { t } = useTranslation();

  const {
    watch,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<BankShiftFormFieldValues>();

  const shiftStart = watch("shift_start");

  const shiftEnd = watch("shift_end");

  const breakStart = watch("break_start");

  const breakEnd = watch("break_end");

  const isMonday = day === "monday";

  const isTimePickerDisabled = () => {
    return day !== "monday";
  };

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const shiftTimeDuration = useMemo(() => {
    const { textFormat } = getTimeDifference({
      start: shiftStart,
      end: shiftEnd,
    });

    return textFormat;
  }, [shiftStart, shiftEnd]);

  const breakTimeDuration = useMemo(() => {
    const { textFormat } = getTimeDifference({
      start: breakStart ?? null,
      end: breakEnd ?? null,
    });

    return textFormat;
  }, [breakStart, breakEnd]);

  useMemo(() => {
    if (!breakStart || !shiftStart || !shiftEnd) {
      setValue("break_end", null, {
        shouldDirty: true,
      });

      setValue("break_end", null, {
        shouldDirty: true,
      });
    }

    if (shiftStart && shiftEnd) {
      setValue("shift_hours", getDifferenceInHHmmss(shiftStart, shiftEnd), {
        shouldDirty: true,
      });
    }

    if (breakStart && breakEnd) {
      setValue("break_hours", getDifferenceInHHmmss(breakStart, breakEnd), {
        shouldDirty: true,
      });
    } else if (!breakStart && !breakEnd) {
      setValue("break_hours", null, {
        shouldDirty: true,
      });
    }
  }, [breakStart, breakEnd, shiftStart, shiftEnd]);

  return (
    <Grid
      container
      spacing={2}
      sx={{
        width: "100%",
      }}
    >
      <Grid item xs={1.5}>
        <Typography
          variant="subtitle2"
          textTransform="capitalize"
          fontWeight={600}
        >
          {day}
        </Typography>
      </Grid>

      <Grid item xs={1.5}>
        <TimePicker
          disabled={isTimePickerDisabled() || disabled}
          loading={loading}
          control={control}
          name="shift_start"
          error={isMonday && !!errors.shift_start}
          helperText={
            isMonday && errors.shift_start
              ? errorMessages(errors.shift_start.message)
              : undefined
          }
        />
      </Grid>

      <Grid item xs={1.5}>
        <TimePicker
          name="shift_end"
          disabled={isTimePickerDisabled() || disabled}
          loading={loading}
          control={control}
          error={isMonday && !!errors?.shift_end}
          helperText={
            isMonday && errors.shift_end
              ? errorMessages(errors.shift_end.message)
              : undefined
          }
        />
      </Grid>

      <Grid item xs={1.5}>
        <Box>
          {loading ? (
            <Skeleton
              height="40px"
              sx={{
                transform: "scale(1)",
              }}
            />
          ) : (
            <Typography variant="body2">{shiftTimeDuration}</Typography>
          )}
        </Box>
      </Grid>

      <Grid item xs={1.5}>
        <TimePicker
          name="break_start"
          control={control}
          shouldDisableTime={(time) =>
            shouldDisableBreakStartTime(time, shiftStart, shiftEnd, breakStart)
          }
          disabled={
            (day === "monday" && shiftStart && shiftEnd ? false : true) ||
            disabled
          }
          loading={loading}
          error={isMonday && !!errors?.break_start}
          helperText={
            isMonday && errors.break_start
              ? errorMessages(errors.break_start.message)
              : undefined
          }
        />
      </Grid>

      <Grid item xs={1.5}>
        <TimePicker
          name="break_end"
          control={control}
          shouldDisableTime={(time) =>
            shouldDisableBreakEndTime(time, shiftEnd, breakEnd, breakStart)
          }
          disabled={(day === "monday" && breakStart ? false : true) || disabled}
          loading={loading}
          error={isMonday && !!errors?.break_end}
          helperText={
            isMonday && errors.break_end
              ? errorMessages(errors.break_end.message)
              : undefined
          }
        />
      </Grid>

      <Grid item xs={1.5}>
        <Box>
          {loading ? (
            <Skeleton
              height="40px"
              sx={{
                transform: "scale(1)",
              }}
            />
          ) : (
            <Typography variant="body2">{breakTimeDuration}</Typography>
          )}
        </Box>
      </Grid>

      <Grid item xs={1.5}>
        <Box>
          {loading ? (
            <Skeleton
              height="40px"
              sx={{
                transform: "scale(1)",
              }}
            />
          ) : (
            <Typography variant="body2">
              {calculateNetWorkingHours(
                shiftStart,
                shiftEnd,
                breakStart,
                breakEnd
              )}
            </Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

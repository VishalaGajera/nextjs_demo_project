import { getTimeInHHmm, TimePicker } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getTimeDifference } from "../../../../../../../utils/date";
import type { DayOfWeek, FixedShiftFormFieldValues } from "./FixedShiftForm";

type FixedShiftTimingRowProps = {
  day: DayOfWeek;
  loading: boolean;
  disabled?: boolean;
};

export const calculateNetWorkingHours = (
  shiftStart?: string | null,
  shiftEnd?: string | null,
  breakStart?: string | null,
  breakEnd?: string | null,
  isBreakFlexible?: boolean,
  breakHours?: string | null
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  if (!shiftStart || !shiftEnd) {
    return "0h 0m";
  }

  const { duration: totalShiftDuration } = getTimeDifference({
    start: shiftStart,
    end: shiftEnd,
  });

  const { duration: breakDuration } = getTimeDifference({
    start: breakStart ? breakStart : null,
    end: breakEnd ? breakEnd : null,
  });

  if (!totalShiftDuration?.isValid) {
    return "0h 0m";
  }

  if (totalShiftDuration && !breakDuration?.isValid) {
    const hours = Math.floor(totalShiftDuration.as("hours"));

    const minutes = Math.floor(totalShiftDuration.as("minutes")) % 60;

    return `${hours}h ${minutes}m`;
  }

  if (totalShiftDuration.isValid && breakDuration.isValid && !isBreakFlexible) {
    const netWorkingDuration = totalShiftDuration.minus(breakDuration);

    const hours = Math.max(0, Math.floor(netWorkingDuration.as("hours")));

    const minutes = Math.max(
      0,
      Math.floor(netWorkingDuration.as("minutes")) % 60
    );

    return `${hours}h ${minutes}m`;
  } else if (isBreakFlexible) {
    const breakHoursDuration = breakHours
      ? getTimeDifference({
          start: "00:00",
          end: breakHours,
        }).duration
      : null;

    if (breakHoursDuration?.isValid && totalShiftDuration?.isValid) {
      const netWorkingDuration = totalShiftDuration?.minus(breakHoursDuration);

      const hours = Math.max(0, Math.floor(netWorkingDuration.as("hours")));

      const minutes = Math.max(
        0,
        Math.floor(netWorkingDuration.as("minutes")) % 60
      );

      return `${hours}h ${minutes}m`;
    }

    const hours = Math.floor(totalShiftDuration.as("hours"));

    const minutes = Math.floor(totalShiftDuration.as("minutes")) % 60;

    return `${hours}h ${minutes}m`;
  } else if (!breakHours || typeof breakHours !== "string") {
    return "0h 0m";
  }

  return "0h 0m";
};

export const shouldDisableBreakStartTime = (
  time: DateTime,
  shiftStart: string | null,
  shiftEnd: string | null,
  breakStart?: string | null
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  if (shiftStart && shiftEnd) {
    const start = DateTime.fromISO(shiftStart);

    const end = DateTime.fromISO(shiftEnd);

    if (end < start) {
      if (start.minute > 0) {
        if (time.hour == start.hour || breakStart) {
          const breakStartHour = breakStart
            ? DateTime.fromISO(breakStart)
            : null;

          return breakStartHour?.hour
            ? time < start && time > end
            : time > start;
        }
      }

      return !(time >= start || time <= end.plus({ hour: 0 }));
    }

    if (time < start) {
      if (breakStart) {
        const breakStartHour = DateTime.fromISO(breakStart);

        if (breakStartHour.hour === start.hour) {
          if (start.minute > 0) {
            return time.minute < start.minute || time.hour < start.hour;
          }

          return time.hour < start.hour;
        }

        return time.hour < start.hour;
      }

      if (start.minute == 0) {
        return time < end;
      }

      if (time.hour === start.hour) {
        return time.hour < start.hour;
      } else if (start.minute > 0) {
        return time.minute < start.minute;
      }

      return time.minute < start.minute;
    }

    return time > end;
  }

  return false;
};

export const shouldDisableBreakEndTime = (
  time: DateTime,
  shiftEnd: string | null,
  breakEnd?: string | null,
  breakStart?: string | null
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  if (breakStart && shiftEnd) {
    const start = DateTime.fromISO(breakStart);

    const end = DateTime.fromISO(shiftEnd);

    if (end < start) {
      if (time.hour == start.hour || breakEnd) {
        const breakStartHour = breakEnd ? DateTime.fromISO(breakEnd) : null;

        return breakStartHour?.hour ? time < start && time > end : time > start;
      }

      return !(time >= start || time <= end);
    }

    if (time < start) {
      if (breakEnd) {
        const breakEndHour = DateTime.fromISO(breakEnd);

        if (breakEndHour.hour === start.hour) {
          if (start.minute > 0) {
            return time.minute < start.minute || time.hour < start.hour;
          }

          return time.hour < start.hour;
        }

        return time.hour < start.hour;
      }

      if (start.minute == 0) {
        return time < end;
      } else if (time.hour === start.hour) {
        return time.hour < start.hour;
      }

      return time.minute < start.minute;
    }

    return time > end;
  }

  return false;
};

export const FixedShiftTimingRow = ({
  day,
  loading,
  disabled = false,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}: FixedShiftTimingRowProps) => {
  const { t } = useTranslation();

  const {
    watch,
    control,
    formState: { errors },
    setError,
    clearErrors,
    resetField,
    setValue,
  } = useFormContext<FixedShiftFormFieldValues>();

  const isBreakFlexible = watch("timings.is_flexible_break");

  const isVariedByDay = watch("timings.is_varied_by_day");

  const shiftStart = watch(`timings.day_configuration.${day}.shift_start`);

  const shiftEnd = watch(`timings.day_configuration.${day}.shift_end`);

  const breakStart = watch(`timings.day_configuration.${day}.break_start`);

  const breakEnd = watch(`timings.day_configuration.${day}.break_end`);

  const breakHours = watch(`timings.day_configuration.${day}.break_hours`);

  const { duration: breakGrossHour } = getTimeDifference({
    start: breakStart,
    end: breakEnd,
  });

  const isTimePickerDisabled = () => !!(!isVariedByDay && day !== "monday");

  const errorMessages = (messageKey?: string) => messageKey && t(messageKey);

  const minFullDayHours = watch("applicable_criteria.min_full_day_hours") ?? "";

  const minHalfDayHours = watch("applicable_criteria.min_half_day_hours") ?? "";

  const maxWorkingHoursPerDay = watch(
    "applicable_criteria.max_working_hours_per_day"
  );

  const getWorkingHours = calculateNetWorkingHours(
    shiftStart,
    shiftEnd,
    breakStart,
    breakEnd,
    isBreakFlexible,
    breakHours
  );

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    if (shiftEnd && shiftStart) {
      const toLocalShiftStart = getTimeInHHmm(shiftStart);

      const toLocalShiftEnd = getTimeInHHmm(shiftEnd);

      const dayShift = toLocalShiftEnd > toLocalShiftStart;

      const nightShift = toLocalShiftEnd < toLocalShiftStart;

      const toLocalBreakStart = breakStart && getTimeInHHmm(breakStart);

      const toLocalBreakEnd = breakEnd && getTimeInHHmm(breakEnd);

      if (toLocalShiftStart && toLocalShiftEnd && toLocalBreakStart) {
        if (dayShift) {
          const isBreakStartInRange =
            toLocalBreakStart > toLocalShiftStart &&
            toLocalBreakStart < toLocalShiftEnd;

          if (!isBreakStartInRange) {
            setError(`timings.day_configuration.${day}.break_start`, {
              type: "custom",
              message:
                "Break from time cannot be earlier than the shift from time or later than the shift to time. Please enter a valid break time.",
            });
          } else {
            clearErrors(`timings.day_configuration.${day}.break_start`);
          }
        }

        if (nightShift) {
          const isBreakStartInNightRange =
            toLocalBreakStart < toLocalShiftStart &&
            toLocalBreakStart > toLocalShiftEnd;

          if (isBreakStartInNightRange) {
            setError(`timings.day_configuration.${day}.break_start`, {
              type: "custom",
              message:
                "Break from time cannot be earlier than the shift from time or later than the shift to time. Please enter a valid break time.",
            });
          } else {
            clearErrors(`timings.day_configuration.${day}.break_start`);
          }
        }
      }

      if (
        toLocalShiftStart &&
        toLocalShiftEnd &&
        toLocalBreakStart &&
        toLocalBreakEnd
      ) {
        if (dayShift) {
          const isBreakEndInRange =
            toLocalBreakEnd > toLocalBreakStart &&
            toLocalBreakEnd < toLocalShiftEnd;

          if (!isBreakEndInRange) {
            setError(`timings.day_configuration.${day}.break_end`, {
              type: "custom",
              message:
                "Break to time must be after Break from time and before Shift To time. Please enter a valid break time.",
            });
          } else {
            clearErrors(`timings.day_configuration.${day}.break_end`);
          }
        }

        if (nightShift) {
          const isBreakEndInNightRange =
            toLocalBreakEnd < toLocalBreakStart &&
            toLocalBreakEnd > toLocalShiftEnd;

          if (isBreakEndInNightRange) {
            setError(`timings.day_configuration.${day}.break_end`, {
              type: "custom",
              message:
                "Break to time must be after Break from time and before Shift To time. Please enter a valid break time.",
            });
          } else {
            clearErrors(`timings.day_configuration.${day}.break_end`);
          }
        }
      }
    }

    if (getWorkingHours) {
      const match = getWorkingHours.match(/\d+/g);

      if (match) {
        const [hours, minutes] = match.map(Number);

        const getConvertedTime = DateTime.fromObject({
          hour: hours,
          minute: minutes,
        }).toFormat("HH:mm:ss");

        if (minHalfDayHours) {
          const minHalfDayTime = getTimeInHHmm(minHalfDayHours, "HH:mm:ss");

          if (getConvertedTime < minHalfDayTime) {
            setError("applicable_criteria.min_half_day_hours", {
              type: "custom",
              message: "Half Day hours must be less than Effective Work Hours",
            });
          } else {
            clearErrors("applicable_criteria.min_half_day_hours");
          }
        }

        if (minFullDayHours && minHalfDayHours) {
          const minHalfDayTime = getTimeInHHmm(minHalfDayHours, "HH:mm:ss");

          const minFullDayTime = getTimeInHHmm(minFullDayHours, "HH:mm:ss");

          if (
            minHalfDayTime > minFullDayTime ||
            getConvertedTime < minFullDayTime
          ) {
            setError("applicable_criteria.min_full_day_hours", {
              type: "custom",
              message:
                "Full Day hours must be greater than half-day hours and less than or equal to effective work hours.",
            });
          } else {
            clearErrors("applicable_criteria.min_full_day_hours");
          }
        }

        if (maxWorkingHoursPerDay) {
          const maxWorkingHours = getTimeInHHmm(
            maxWorkingHoursPerDay,
            "HH:mm:ss"
          );

          if (getConvertedTime > maxWorkingHours) {
            setError("applicable_criteria.max_working_hours_per_day", {
              type: "custom",
              message:
                "Maximum allowed out punch time cannot be earlier than effective work hours.",
            });
          } else {
            clearErrors("applicable_criteria.max_working_hours_per_day");
          }
        }
      }
    }
  }, [breakStart, breakEnd, shiftStart, shiftEnd]);

  useEffect(() => {
    if (!breakStart || !shiftStart || !shiftEnd) {
      resetField(`timings.day_configuration.${day}.break_end`, {
        defaultValue: null,
      });
      setValue(`timings.day_configuration.${day}.break_hours`, null);
      resetField(`timings.day_configuration.${day}.break_start`, {
        defaultValue: null,
      });
    }
  }, [breakStart, shiftStart, shiftEnd]);

  useEffect(() => {
    if (!isBreakFlexible || breakHours) {
      clearErrors(`timings.day_configuration.${day}.break_hours`);
    }
  }, [breakHours, isBreakFlexible]);

  useEffect(() => {
    if (breakStart && breakEnd && !isBreakFlexible) {
      const breakHoursInHHmmss = getTimeDifference({
        start: breakStart,
        end: breakEnd,
      }).duration.toFormat("hh:mm");

      setValue(
        `timings.day_configuration.${day}.break_hours`,
        breakHoursInHHmmss
      );
    }

    if (shiftStart && shiftEnd) {
      const shiftHoursInHHmmss = getTimeDifference({
        start: shiftStart,
        end: shiftEnd,
      }).duration.toFormat("hh:mm");

      setValue(
        `timings.day_configuration.${day}.shift_hours`,
        shiftHoursInHHmmss
      );
    }
  }, [breakStart, breakEnd, shiftStart, shiftEnd]);

  const dayConfigErrors = errors?.timings?.day_configuration?.[day];

  return (
    <Stack direction="row" sx={{ minWidth: "100%" }} gap="10px">
      <Typography
        mt="10px"
        textTransform="capitalize"
        sx={{ minWidth: "175px" }}
      >
        {day}
      </Typography>
      <Box width="100%" maxWidth="250px">
        <TimePicker
          loading={loading}
          ampm={false}
          disabled={isTimePickerDisabled() || disabled}
          control={control}
          name={`timings.day_configuration.${day}.shift_start`}
          error={!isTimePickerDisabled() && !!dayConfigErrors?.shift_start}
          helperText={
            !isTimePickerDisabled() && dayConfigErrors?.shift_start?.message
              ? errorMessages(dayConfigErrors?.shift_start?.message)
              : undefined
          }
        />
      </Box>
      <Box width="100%" maxWidth="250px">
        <TimePicker
          loading={loading}
          ampm={false}
          disabled={isTimePickerDisabled() || disabled}
          control={control}
          name={`timings.day_configuration.${day}.shift_end`}
          error={!isTimePickerDisabled() && !!dayConfigErrors?.shift_end}
          helperText={
            !isTimePickerDisabled() && dayConfigErrors?.shift_end?.message
              ? errorMessages(dayConfigErrors?.shift_end?.message)
              : undefined
          }
        />
      </Box>

      <Typography mt="10px" sx={{ width: "100%", maxWidth: "250px" }}>
        {getTimeDifference({ start: shiftStart, end: shiftEnd }).textFormat}
      </Typography>
      <Box width="100%" maxWidth="250px">
        <TimePicker
          loading={loading}
          ampm={false}
          disabled={
            (!(!isVariedByDay && day !== "monday") && shiftStart && shiftEnd
              ? false
              : true) || disabled
          }
          control={control}
          name={`timings.day_configuration.${day}.break_start`}
          error={!isTimePickerDisabled() && !!dayConfigErrors?.break_start}
          helperText={
            !isTimePickerDisabled()
              ? errorMessages(dayConfigErrors?.break_start?.message)
              : undefined
          }
        />
      </Box>
      <Box width="100%" maxWidth="250px">
        <TimePicker
          loading={loading}
          ampm={false}
          disabled={
            (!(!isVariedByDay && day !== "monday") && breakStart
              ? false
              : true) || disabled
          }
          control={control}
          name={`timings.day_configuration.${day}.break_end`}
          error={!isTimePickerDisabled() && !!dayConfigErrors?.break_end}
          helperText={
            !isTimePickerDisabled()
              ? errorMessages(dayConfigErrors?.break_end?.message)
              : undefined
          }
        />
      </Box>
      {isBreakFlexible ? (
        <Box width="100%" maxWidth="250px">
          <TimePicker
            loading={loading}
            ampm={false}
            disabled={
              (!(!isVariedByDay && day !== "monday") && shiftStart && shiftEnd
                ? false
                : true) || disabled
            }
            control={control}
            isReturnLocalTime
            name={`timings.day_configuration.${day}.break_hours`}
            value={
              breakGrossHour ? DateTime.fromISO(`${breakGrossHour}`) : null
            }
            error={!isTimePickerDisabled() && !!dayConfigErrors?.break_hours}
            helperText={
              !isTimePickerDisabled()
                ? errorMessages(dayConfigErrors?.break_hours?.message)
                : undefined
            }
          />
        </Box>
      ) : (
        <Typography mt="10px" sx={{ width: "100%", maxWidth: "250px" }}>
          {getTimeDifference({ start: breakStart, end: breakEnd }).textFormat}
        </Typography>
      )}
      <Typography mt="10px" sx={{ width: "100%", maxWidth: "250px" }}>
        {calculateNetWorkingHours(
          shiftStart,
          shiftEnd,
          breakStart,
          breakEnd,
          isBreakFlexible,
          breakHours
        )}
      </Typography>
    </Stack>
  );
};

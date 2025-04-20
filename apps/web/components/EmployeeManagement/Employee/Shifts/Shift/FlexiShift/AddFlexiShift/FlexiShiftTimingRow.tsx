import { getTimeInHHmm, TimePicker } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { DateTime, Duration } from "luxon";
import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getTimeDifference } from "../../../../../../../utils/date";
import type { DayOfWeek, FlexiShiftFormFieldValues } from "./FlexiShiftForm";

type FlexiShiftTimingRowProps = {
  day: DayOfWeek;
  loading: boolean;
  disabled?: boolean;
};

export const calculateNetWorkingHours = (
  shiftGrossHours?: string | null,
  isBreakFlexible?: boolean,
  breakHours?: string | null,
  breakStart?: string | null,
  breakEnd?: string | null
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  if (!shiftGrossHours || typeof shiftGrossHours !== "string") {
    return "0h 0m";
  }

  const timeParts = shiftGrossHours.split(":").map(Number);

  if (
    (timeParts.length !== 2 && timeParts.length !== 3) ||
    timeParts.some(isNaN)
  ) {
    return "0h 0m";
  }

  const [hours, minutes, seconds] = timeParts;

  let netWorkingDuration = Duration.fromObject({
    hours,
    minutes,
    seconds: seconds ?? 0,
  });

  if (isBreakFlexible) {
    const breakDuration = getTimeDifference({
      start: "00:00",
      end: breakHours ?? "00:00",
    }).duration;

    if (breakDuration.isValid && netWorkingDuration.isValid) {
      netWorkingDuration = netWorkingDuration?.minus(breakDuration);
    }
  } else if (breakStart && breakEnd) {
    const breakDuration = getTimeDifference({
      start: breakStart,
      end: breakEnd,
      format: ["hours", "minutes"],
    }).duration;

    if (breakDuration.isValid && netWorkingDuration.isValid) {
      netWorkingDuration = netWorkingDuration.minus(breakDuration);
    }
  } else if (!breakHours || typeof breakHours !== "string") {
    return `${hours}h ${minutes}m `;
  }

  const netHours = Math.floor(netWorkingDuration.as("hours"));

  const netMinutes = Math.floor(netWorkingDuration.as("minutes")) % 60;

  return `${netHours}h ${netMinutes}m`;
};

export const FlexiShiftTimingRow = ({
  day,
  loading,
  disabled = false,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}: FlexiShiftTimingRowProps) => {
  const { t } = useTranslation();

  const {
    watch,
    control,
    formState: { errors },
    setError,
    clearErrors,
    resetField,
    setValue,
  } = useFormContext<FlexiShiftFormFieldValues>();

  const isBreakFlexible = watch("timings.is_flexible_break");

  const isVariedByDay = watch("timings.is_varied_by_day");

  const shiftStart = watch(`timings.day_configuration.${day}.shift_start`);

  const shiftEnd = watch(`timings.day_configuration.${day}.shift_end`);

  const breakStart = watch(`timings.day_configuration.${day}.break_start`);

  const breakEnd = watch(`timings.day_configuration.${day}.break_end`);

  const shiftGrossHours = watch(`timings.day_configuration.${day}.shift_hours`);

  const breakHours = watch(`timings.day_configuration.${day}.break_hours`);

  const isTimePickerDisabled = () => !!(!isVariedByDay && day !== "monday");

  const minFullDayHours = watch("applicable_criteria.min_full_day_hours") ?? "";

  const minHalfDayHours = watch("applicable_criteria.min_half_day_hours") ?? "";

  const maxWorkingHoursPerDay = watch(
    "applicable_criteria.max_working_hours_per_day"
  );

  const getWorkingHours = calculateNetWorkingHours(
    shiftGrossHours,
    isBreakFlexible,
    breakHours ? DateTime.fromISO(breakHours).toISO() : null,
    breakStart ? DateTime.fromISO(breakStart).toISO() : null,
    breakEnd ? DateTime.fromISO(breakEnd).toISO() : null
  );

  const calculateBreakGrossHour = () => {
    if (breakStart && breakEnd) {
      const duration = getTimeDifference({
        start: breakStart,
        end: breakEnd,
      }).duration;

      return duration.toFormat("hh:mm:ss");
    }
  };

  const errorMessages = (messageKey?: string) => messageKey && t(messageKey);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    if (shiftEnd && shiftStart && breakStart) {
      if (shiftEnd > shiftStart) {
        const isBreakStartInRange =
          breakStart > shiftStart && breakStart < shiftEnd;

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

      if (shiftEnd < shiftStart) {
        const isBreakStartInRange =
          breakStart < shiftStart && breakStart > shiftEnd;

        if (isBreakStartInRange) {
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

    if (shiftEnd && shiftStart && breakStart && breakEnd) {
      if (shiftEnd > shiftStart) {
        const isBreakStartInRange =
          breakEnd <= breakStart || breakEnd >= shiftEnd;

        if (isBreakStartInRange) {
          setError(`timings.day_configuration.${day}.break_end`, {
            type: "custom",
            message:
              "Break to time must be after Break from time and before Shift To time. Please enter a valid break time.",
          });
        } else {
          clearErrors(`timings.day_configuration.${day}.break_end`);
        }
      }

      if (shiftEnd < shiftStart) {
        const isBreakStartInRange =
          breakEnd >= breakStart || breakEnd <= shiftEnd;

        if (isBreakStartInRange) {
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
              message: "Half Day hours must be less than Effective Work Hours.",
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
  }, [breakStart, breakEnd, shiftStart, shiftEnd, shiftGrossHours]);

  useMemo(() => {
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
    if (shiftGrossHours?.length) {
      clearErrors(`timings.day_configuration.${day}.shift_hours`);
    }
  }, [shiftGrossHours]);

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
      <Box width="100%" maxWidth="250px">
        <TimePicker
          loading={loading}
          ampm={false}
          disabled={isTimePickerDisabled() || disabled}
          control={control}
          isReturnLocalTime
          name={`timings.day_configuration.${day}.shift_hours`}
          error={!isTimePickerDisabled() && !!dayConfigErrors?.shift_hours}
          helperText={
            !isTimePickerDisabled() && dayConfigErrors?.shift_hours?.message
              ? errorMessages(dayConfigErrors?.shift_hours?.message)
              : undefined
          }
        />
      </Box>
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
            (!(!isVariedByDay && day !== "monday") &&
            breakStart &&
            shiftStart &&
            shiftEnd
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
            disabled={isTimePickerDisabled() || disabled}
            control={control}
            name={`timings.day_configuration.${day}.break_hours`}
            isReturnLocalTime
            value={
              calculateBreakGrossHour()
                ? DateTime.fromISO(calculateBreakGrossHour() ?? "")
                : null
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
          shiftGrossHours,
          isBreakFlexible,
          breakHours,
          breakStart,
          breakEnd
        )}
      </Typography>
    </Stack>
  );
};

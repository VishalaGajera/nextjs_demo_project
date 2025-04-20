import { DateTime, Duration } from "luxon";
import type { AutoShiftTypes } from "../AutoShiftForm/AutoShiftForm";

export const modifyTimeInDateTime = (
  shiftRecords: AutoShiftTypes[],
  referenceDate: string
): AutoShiftTypes[] => {
  const referenceDateTime = DateTime.fromISO(referenceDate, { zone: "UTC" });

  let previousShiftEnd = referenceDateTime;

  return shiftRecords.map(({ clock_in_start, clock_in_end }) => {
    let shiftStart = DateTime.fromISO(
      `${referenceDateTime.toISODate()}T${clock_in_start}`,
      { zone: "UTC" }
    );

    if (shiftStart < previousShiftEnd) {
      shiftStart = shiftStart.plus({ days: 1 });
    }

    let shiftEnd = DateTime.fromISO(
      `${referenceDateTime.toISODate()}T${clock_in_end}`,
      { zone: "UTC" }
    );

    if (shiftEnd < shiftStart) {
      shiftEnd = shiftEnd.plus({ days: 1 });
    }

    previousShiftEnd = shiftEnd;

    return {
      clock_in_start: shiftStart.toISO(),
      clock_in_end: shiftEnd.toISO(),
    };
  });
};

export const handleTwentyFourHoursTime = (
  shiftData: AutoShiftTypes[]
): boolean => {
  if (!shiftData.length || !shiftData[0]?.clock_in_start) {
    return false;
  }

  const firstShiftStartTime = DateTime.fromISO(shiftData[0].clock_in_start);

  const twentyFourHourThreshold = firstShiftStartTime.plus({ hours: 24 });

  return shiftData.some(({ clock_in_start, clock_in_end }) => {
    const shiftStartTime = DateTime.fromISO(clock_in_start ?? "");

    const shiftEndTime = DateTime.fromISO(clock_in_end ?? "");

    return (
      shiftStartTime >= twentyFourHourThreshold ||
      shiftEndTime >= twentyFourHourThreshold
    );
  });
};

export const calculateNetWorkingShiftHours = (
  shiftHours: string,
  breakHours: string
) => {
  const isValidShiftHours = Duration.fromISOTime(shiftHours).isValid;

  const isValidBreakHours = Duration.fromISOTime(breakHours).isValid;

  if (!shiftHours || !isValidShiftHours) {
    return "00:00:00";
  }

  const shiftDuration = Duration.fromISOTime(shiftHours);

  if (breakHours && !isValidBreakHours) {
    return shiftDuration.toFormat("hh:mm:ss");
  }

  const breakDuration = breakHours
    ? Duration.fromISOTime(breakHours)
    : Duration.fromMillis(0);

  const netDuration = shiftDuration.minus(breakDuration);

  return netDuration.toFormat("hh:mm:ss");
};

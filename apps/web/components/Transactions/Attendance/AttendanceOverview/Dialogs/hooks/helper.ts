import { getTimeInHHmm } from "@codezee/sixtify-brahma";
import { DateTime } from "luxon";
import type { AutoShiftType } from "./type";

export const modifyLogTimeInDateTime = (
  shiftRecords: AutoShiftType[],
  referenceDate: string
) => {
  const referenceDateTime = DateTime.fromISO(referenceDate, {
    zone: "UTC",
  });

  // eslint-disable-next-line sonarjs/cognitive-complexity
  return shiftRecords.map((record) => {
    const shiftStart = DateTime.fromISO(
      `${referenceDateTime.toISODate()}T${record.shift_start ?? ""}`,
      { zone: "UTC" }
    );

    let shiftEnd = DateTime.fromISO(
      `${referenceDateTime.toISODate()}T${record.shift_end ?? ""}`,
      { zone: "UTC" }
    );

    // If shift_start is greater than shift_end, it's a night shift → shift_end should be on the next day
    if (getTimeInHHmm(record.shift_start) > getTimeInHHmm(record.shift_end)) {
      shiftEnd = shiftEnd.plus({ days: 1 });
    }

    const dayNightShift =
      getTimeInHHmm(record.slot_start) < getTimeInHHmm(record.slot_end);

    const slotStart = DateTime.fromISO(
      `${referenceDateTime.toISODate()}T${record.slot_start}`,
      {
        zone: "utc",
      }
    ).minus({ day: dayNightShift ? 1 : 0 });

    const slotEnd = DateTime.fromISO(
      `${referenceDateTime.toISODate()}T${record.slot_end}`,
      {
        zone: "utc",
      }
    )
      .plus({ day: dayNightShift ? 0 : 1 })
      .set({ second: 0, millisecond: 0 });

    return {
      shift_start: shiftStart.toISO() ?? "",
      shift_end: shiftEnd.toISO() ?? "",
      slot_start: slotStart.toISO() ?? "",
      slot_end: slotEnd.toISO() ?? "",
      clock_in_start: record.clock_in_start ?? "",
      clock_in_end: record.clock_in_end ?? "",
      shift_type_name: record.shift_type_name,
    };
  });
};

export const checkLogTime = (
  firstLogInData: string,
  modifyAutoShiftTime: AutoShiftType[]
) => {
  if (!modifyAutoShiftTime) {
    return;
  }

  const firstLogInDate = getTimeInHHmm(firstLogInData);

  const result =
    modifyAutoShiftTime
      // eslint-disable-next-line sonarjs/no-invariant-returns
      .map((data) => {
        const shiftStart = getTimeInHHmm(data.clock_in_start);

        const shiftEnd = getTimeInHHmm(data.clock_in_end);

        if (shiftStart > shiftEnd) {
          if (firstLogInDate >= shiftStart || firstLogInDate <= shiftEnd) {
            return data;
          }

          return null;
        }

        if (firstLogInDate >= shiftStart && firstLogInDate <= shiftEnd) {
          return data;
        }

        return null;
      })
      .find((item) => item !== null) || null;

  return result;
};

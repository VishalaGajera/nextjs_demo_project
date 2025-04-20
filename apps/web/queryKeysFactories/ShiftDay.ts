export const shiftDayKeys = {
  all: ["shift-day"] as const,

  listing: (body: object = {}) => [...shiftDayKeys.all, "listing", body],

  updateShift: (employeeIds: string[]) => [
    ...shiftDayKeys.all,
    "edit",
    employeeIds,
  ],

  updateWeeklyOff: (employeeIds: string[]) => [
    ...shiftDayKeys.all,
    "edit",
    employeeIds,
  ],

  updateHoliday: (employeeIds: string[]) => [
    ...shiftDayKeys.all,
    "edit",
    employeeIds,
  ],
};

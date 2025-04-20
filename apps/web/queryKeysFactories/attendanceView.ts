export const attendanceViewKey = {
  all: ["attendance-view-employee"] as const,

  listing: (body: object = {}) => [...attendanceViewKey.all, "listing", body],

  get: (employeeId: string | null, date: string | null) => [
    ...attendanceViewKey.all,
    "listing",
    employeeId,
    date,
  ],

  add: () => [...attendanceViewKey.all, "add"],
};

export const attendanceDetailsKey = {
  all: ["attendance-details-employee"] as const,

  get: (employeeId: string | null, date: string | null) => [
    ...attendanceViewKey.all,
    "listing",
    employeeId,
    date,
  ],

  getMeta: (
    employeeId: string | null,
    date: string | null,
    currentFullDate: string
  ) => [
    ...attendanceDetailsKey.all,
    "listing",
    employeeId,
    date,
    currentFullDate,
  ],
};

export const attendanceLogsKey = {
  all: ["attendance-logs"] as const,

  get: (employeeId: string | null, date: string | null) => [
    ...attendanceViewKey.all,
    "listing",
    employeeId,
    date,
  ],
};

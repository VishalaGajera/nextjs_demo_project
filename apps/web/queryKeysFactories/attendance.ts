export const bulkAttendanceKeys = {
  all: ["bulk-attendance"] as const,

  listing: (body: object = {}) => [...bulkAttendanceKeys.all, "listing", body],
};

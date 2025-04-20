export const leaveBalanceSummaryKey = {
  all: ["leave-balance-summary"] as const,

  listing: (body: object = {}) => [
    ...leaveBalanceSummaryKey.all,
    "listing",
    body,
  ],

  get: (employeeId: string) => [
    ...leaveBalanceSummaryKey.all,
    "get",
    employeeId,
  ],

  edit: (employeeId: string) => [
    ...leaveBalanceSummaryKey.all,
    "edit",
    employeeId,
  ],
};

export const overtimeRulesAllocation = {
  all: ["bulk-attendance"] as const,

  listing: (body: object = {}) => [
    ...overtimeRulesAllocation.all,
    "listing",
    body,
  ],

  edit: (employeeIds: string[]) => [
    ...overtimeRulesAllocation.all,
    "edit",
    employeeIds,
  ],
};

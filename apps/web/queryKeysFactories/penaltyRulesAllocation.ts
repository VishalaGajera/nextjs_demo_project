export const penaltyRulesAllocation = {
  all: ["bulk-penalty-rule"] as const,

  listing: (body: object = {}) => [
    ...penaltyRulesAllocation.all,
    "listing",
    body,
  ],

  edit: (employeeIds: string[]) => [
    ...penaltyRulesAllocation.all,
    "edit",
    employeeIds,
  ],
};

export const leavePlanKeys = {
  all: ["leave_plan"] as const,

  listing: (requestBody: object = {}) =>
    [...leavePlanKeys.all, "listing", requestBody] as const,

  add: () => [...leavePlanKeys.all, "add"],

  edit: (currentLeavePlanId: string) => [
    ...leavePlanKeys.all,
    "edit",
    currentLeavePlanId,
  ],

  delete: (currentLeavePlanId: string) => [
    ...leavePlanKeys.all,
    "delete",
    currentLeavePlanId,
  ],

  get: (currentLeavePlanId: string) => [
    ...leavePlanKeys.all,
    "get",
    currentLeavePlanId,
  ],

  options: (companyId?: string | null) => [
    ...leavePlanKeys.all,
    "options",
    companyId,
  ],
};

export const leavePlanTypeKeys = {
  all: ["leave_plan_type"] as const,

  listing: (leavePlanId: string) =>
    [...leavePlanTypeKeys.all, "listing", leavePlanId] as const,

  add: (leavePlanId: string) => [...leavePlanTypeKeys.all, "add", leavePlanId],

  delete: (leavePlanId: string, LeaveTypeId: string) => [
    ...leavePlanTypeKeys.all,
    "delete",
    leavePlanId,
    LeaveTypeId,
  ],

  setup: (leavePlanId: string, LeaveTypeId: string) => [
    ...leavePlanTypeKeys.all,
    "delete",
    leavePlanId,
    LeaveTypeId,
  ],

  optionsPerEmployee: (
    leavePlanId: string,
    employeeId: string,
    fromDate: string
  ) => [...leavePlanTypeKeys.all, "delete", leavePlanId, employeeId, fromDate],
};

export const configureLeaveKeys = {
  all: ["configure-Leave"] as const,

  add: (leavePlanId: string, LeaveTypeId: string) => [
    ...configureLeaveKeys.all,
    "add",
    leavePlanId,
    LeaveTypeId,
  ],

  edit: (leavePlanId: string, LeaveTypeId: string) => [
    ...configureLeaveKeys.all,
    "add",
    leavePlanId,
    LeaveTypeId,
  ],

  options: (leavePlanId: string, leaveTypeId: string) => [
    ...configureLeaveKeys.all,
    "options",
    leavePlanId,
    leaveTypeId,
  ],
};

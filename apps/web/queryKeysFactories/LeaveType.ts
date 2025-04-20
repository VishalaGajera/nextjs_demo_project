export const leaveTypeKeys = {
  all: ["leave-type"] as const,

  listing: (body: object = {}) => [...leaveTypeKeys.all, "listing", body],

  add: () => [...leaveTypeKeys.all, "add"],

  edit: (leaveTypeId: string) => [...leaveTypeKeys.all, "edit", leaveTypeId],

  get: (leaveTypeId: string) => [...leaveTypeKeys.all, "get", leaveTypeId],

  delete: (leaveTypeId: string) => [
    ...leaveTypeKeys.all,
    "delete",
    leaveTypeId,
  ],

  options: (leaveTypeId: string) => [
    ...leaveTypeKeys.all,
    "options",
    leaveTypeId,
  ],

  optionsPerCompany: (companyId: string) => [
    ...leaveTypeKeys.all,
    "options",
    companyId,
  ],
};

export const leavePlanTypeKeys = {
  all: ["leave_plan_type"] as const,

  options: (leavePlanId?: string | null) => [
    ...leavePlanTypeKeys.all,
    "options",
    leavePlanId,
  ],
};

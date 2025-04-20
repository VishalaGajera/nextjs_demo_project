export const employeeShiftDetailKeys = {
  all: ["employee-shift"] as const,

  listing: (body: object = {}) => [
    ...employeeShiftDetailKeys.all,
    "listing",
    body,
  ],

  add: () => [...employeeShiftDetailKeys.all, "add"],

  edit: (shiftId: string) => [...employeeShiftDetailKeys.all, "edit", shiftId],

  get: (shiftId: string) => [...employeeShiftDetailKeys.all, "get", shiftId],

  delete: (shiftId: string) => [
    ...employeeShiftDetailKeys.all,
    "delete",
    shiftId,
  ],

  options: (companyId?: string | null) => [
    ...employeeShiftDetailKeys.all,
    "options",
    companyId,
  ],
};

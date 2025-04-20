export const employeeEducationKeys = {
  all: ["employee-education"] as const,

  listing: (body: object = {}) => [
    ...employeeEducationKeys.all,
    "listing",
    body,
  ],

  add: (employeeId: string) => [
    ...employeeEducationKeys.all,
    "add",
    employeeId,
  ],

  get: (educationDetailId: string) => [
    ...employeeEducationKeys.all,
    "get",
    educationDetailId,
  ],

  edit: (educationDetailId: string) => [
    ...employeeEducationKeys.all,
    "edit",
    educationDetailId,
  ],

  delete: (educationDetailId: string) => [
    ...employeeEducationKeys.all,
    "delete",
    educationDetailId,
  ],
};

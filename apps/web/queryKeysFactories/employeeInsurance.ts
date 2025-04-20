export const employeeInsuranceDetailKeys = {
  all: ["employee-insurance"] as const,

  listing: (body: object = {}) => [
    ...employeeInsuranceDetailKeys.all,
    "listing",
    body,
  ],

  add: (employeeId: string) => [
    ...employeeInsuranceDetailKeys.all,
    "add",
    employeeId,
  ],

  delete: (employee_id: string) => [
    ...employeeInsuranceDetailKeys.all,
    "delete",
    employee_id,
  ],

  get: (employee_id: string) => [
    ...employeeInsuranceDetailKeys.all,
    "get",
    employee_id,
  ],

  edit: (employee_id: string) => [
    ...employeeInsuranceDetailKeys.all,
    "edit",
    employee_id,
  ],
};

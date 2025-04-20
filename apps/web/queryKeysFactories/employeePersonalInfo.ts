export const employeePersonalInfo = {
  all: ["personal-info"] as const,

  get: (employee_id: string) => [
    ...employeePersonalInfo.all,
    "get",
    employee_id,
  ],

  edit: (employee_id: string) => [
    ...employeePersonalInfo.all,
    "edit",
    employee_id,
  ],
};

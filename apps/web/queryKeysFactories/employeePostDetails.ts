export const employeePostDetails = {
  all: ["post-details"] as const,

  get: (employee_id: string, section?: string) => [
    ...employeePostDetails.all,
    "get",
    employee_id,
    section,
  ],

  getHistory: (employee_id: string, section?: string) => [
    ...employeePostDetails.all,
    "get",
    employee_id,
    section,
  ],

  edit: (employee_id: string) => [
    ...employeePostDetails.all,
    "edit",
    employee_id,
  ],
};

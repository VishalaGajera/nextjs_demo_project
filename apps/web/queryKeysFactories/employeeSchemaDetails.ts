export const employeeSchemaDetails = {
  all: ["schema-details"] as const,

  get: (employee_id: string, section?: string) => [
    ...employeeSchemaDetails.all,
    "get",
    employee_id,
    section,
  ],

  edit: (employee_id: string) => [
    ...employeeSchemaDetails.all,
    "edit",
    employee_id,
  ],

  getHistory: (employee_id: string, section: string) => [
    ...employeeSchemaDetails.all,
    "history",
    employee_id,
    section,
  ],
};

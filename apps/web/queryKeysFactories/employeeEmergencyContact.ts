export const employeeEmergencyContact = {
  all: ["emergency-contact"] as const,

  get: (employee_id: string) => [
    ...employeeEmergencyContact.all,
    "get",
    employee_id,
  ],
  edit: (employee_id: string) => [
    ...employeeEmergencyContact.all,
    "edit",
    employee_id,
  ],
};

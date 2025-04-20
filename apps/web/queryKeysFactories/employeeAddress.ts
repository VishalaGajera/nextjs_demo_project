export const employeeAddressKeys = {
  all: ["employee-address"] as const,

  listing: (employee_id: string) => [
    ...employeeAddressKeys.all,
    "listing",
    employee_id,
  ],

  getPresent: (employee_id: string) => [
    ...employeeAddressKeys.all,
    "present",
    employee_id,
  ],

  getPermanent: (employee_id: string) => [
    ...employeeAddressKeys.all,
    "permanent",
    employee_id,
  ],

  edit: (employee_id: string) => [
    ...employeeAddressKeys.all,
    "edit",
    employee_id,
  ],
};

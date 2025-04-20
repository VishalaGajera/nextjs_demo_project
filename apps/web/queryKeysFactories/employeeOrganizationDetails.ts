export const employeeOrganizationDetails = {
  all: ["organization-details"] as const,

  get: (employee_id: string, section?: string) => [
    ...employeeOrganizationDetails.all,
    "get",
    employee_id,
    section,
  ],

  getHistory: (employee_id: string, section?: string) => [
    ...employeeOrganizationDetails.all,
    "history",
    employee_id,
    section,
  ],

  edit: (employee_id: string) => [
    ...employeeOrganizationDetails.all,
    "edit",
    employee_id,
  ],
};

export const businessUnit = {
  all: [...employeeOrganizationDetails.all, "business-unit"] as const,

  edit: (employee_id: string) => [...businessUnit.all, "edit", employee_id],
};

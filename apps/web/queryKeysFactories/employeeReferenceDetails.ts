export const employeeReferenceDetails = {
  all: ["employee-reference-details"] as const,

  get: (employeeId: string) => [
    ...employeeReferenceDetails.all,
    "get",
    employeeId,
  ],

  edit: (employeeId: string) => [
    ...employeeReferenceDetails.all,
    "edit",
    employeeId,
  ],
};

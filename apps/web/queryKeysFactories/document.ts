export const documentKeys = {
  all: ["document"] as const,

  add: (employeeId: string) => [...documentKeys.all, "add", employeeId],

  get: (documentId: string) => [...documentKeys.all, "get", documentId],

  edit: (documentId: string) => [...documentKeys.all, "edit", documentId],

  delete: (documentId: string) => [...documentKeys.all, "delete", documentId],

  listing: (body: object = {}) => [...documentKeys.all, "listing", body],

  options: (employee_id?: string | null) => [
    ...documentKeys.all,
    "options",
    employee_id,
  ],

  verify: (employeeId: string, documentId: string) => [
    ...documentKeys.all,
    "verify",
    employeeId,
    documentId,
  ],
};

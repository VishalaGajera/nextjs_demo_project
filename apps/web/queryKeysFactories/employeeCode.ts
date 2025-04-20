export const employeeCodeKeys = {
  all: ["employee-code"] as const,

  listing: (body: object = {}) => [...employeeCodeKeys.all, "listing", body],

  add: () => [...employeeCodeKeys.all, "add"],

  edit: (employeeCodeId: string) => [
    ...employeeCodeKeys.all,
    "edit",
    employeeCodeId,
  ],

  get: (employeeCodeId: string) => [
    ...employeeCodeKeys.all,
    "get",
    employeeCodeId,
  ],

  delete: (employeeCodeId: string) => [
    ...employeeCodeKeys.all,
    "delete",
    employeeCodeId,
  ],

  options: (companyId?: string | null) => [
    ...employeeCodeKeys.all,
    "options",
    companyId,
  ],

  generateNextCode: (employeeCodeId: string) => [
    ...employeeCodeKeys.all,
    "generate-next-code",
    employeeCodeId,
  ],
};

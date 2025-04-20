export const departmentKeys = {
  all: ["department"] as const,

  listing: (requestBody: object = {}) =>
    [...departmentKeys.all, "listing", requestBody] as const,

  add: () => [...departmentKeys.all, "add"],

  edit: (departmentId: string) => [...departmentKeys.all, "edit", departmentId],

  get: (departmentId: string) => [...departmentKeys.all, "get", departmentId],

  delete: (departmentId: string) => [
    ...departmentKeys.all,
    "delete",
    departmentId,
  ],

  options: (companyId?: string | null) => [
    ...departmentKeys.all,
    "options",
    companyId,
  ],

  multipleOptions: (companyIds: string[]) => [
    ...departmentKeys.all,
    "multiple-options",
    companyIds,
  ],

  departmentOptions: (departmentId: string) => [
    ...departmentKeys.all,
    "department-options",
    departmentId,
  ],
};

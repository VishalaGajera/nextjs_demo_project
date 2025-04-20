export const subDepartmentKeys = {
  all: ["subDepartment"] as const,

  listing: (requestBody: object = {}) =>
    [...subDepartmentKeys.all, "listing", requestBody] as const,

  add: () => [...subDepartmentKeys.all, "add"],

  edit: (subDepartmentId: string) => [
    ...subDepartmentKeys.all,
    "edit",
    subDepartmentId,
  ],

  get: (subDepartmentId: string) => [
    ...subDepartmentKeys.all,
    "get",
    subDepartmentId,
  ],

  delete: (subDepartmentId: string) => [
    ...subDepartmentKeys.all,
    "delete",
    subDepartmentId,
  ],

  options: (departmentId?: string | null) => [
    ...subDepartmentKeys.all,
    "options",
    departmentId,
  ],

  multipleOptions: (departmentIds?: string[] | null) => [
    ...subDepartmentKeys.all,
    "multipleOptions",
    departmentIds,
  ],
};

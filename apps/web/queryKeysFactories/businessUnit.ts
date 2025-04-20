export const businessUnitsKeys = {
  all: ["businessUnit"] as const,

  listing: (body: object = {}) => [...businessUnitsKeys.all, "listing", body],

  add: () => [...businessUnitsKeys.all, "add"],

  edit: (businessUnitId: string) => [
    ...businessUnitsKeys.all,
    "edit",
    businessUnitId,
  ],

  get: (businessUnitId: string) => [
    ...businessUnitsKeys.all,
    "get",
    businessUnitId,
  ],

  delete: (businessUnitId: string) => [
    ...businessUnitsKeys.all,
    "delete",
    businessUnitId,
  ],

  options: (companyId?: string | null) => [
    ...businessUnitsKeys.all,
    "options",
    companyId,
  ],

  multipleOptions: (companyIds: string[]) => [
    ...businessUnitsKeys.all,
    "multiple-options",
    companyIds,
  ],

  employeeOptions: (businessUnitId: string) => [
    ...businessUnitsKeys.all,
    "employee-options",
    businessUnitId,
  ],
};

import type { QueryParams } from "../constants/routes/employee-management/employee/routes";

export const employeeKeys = {
  all: ["employee"] as const,

  listing: (body: object = {}) => [...employeeKeys.all, "listing", body],

  add: () => [...employeeKeys.all, "add"],

  searchMetaData: () => [...employeeKeys.all, "search-metadata"],

  options: (companyId: string, queryParams: QueryParams) => [
    ...employeeKeys.all,
    "options",
    companyId,
    queryParams,
  ],

  optionsWithoutCompany: (queryParams: QueryParams) => [
    ...employeeKeys.all,
    "options-without-company",
    queryParams,
  ],
};

export const employeeBasicDetailsKeys = {
  all: [...employeeKeys.all, "basic-details"] as const,

  edit: (employeeId: string) => [
    ...employeeBasicDetailsKeys.all,
    "edit",
    employeeId,
  ],

  get: (employeeId: string) => [
    ...employeeBasicDetailsKeys.all,
    "get",
    employeeId,
  ],
};

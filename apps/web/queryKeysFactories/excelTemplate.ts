import type { QueryParams } from "../constants/routes/settings/excel-template-configuration/routes";

export const excelTemplateKeys = {
  all: ["excel-template"] as const,

  add: () => [...excelTemplateKeys.all, "add"],

  listing: (body: object = {}) => [...excelTemplateKeys.all, "listing", body],

  get: (excelTemplateId: string) => [
    ...excelTemplateKeys.all,
    "get",
    excelTemplateId,
  ],

  edit: (excelTemplateId: string) => [
    ...excelTemplateKeys.all,
    "edit",
    excelTemplateId,
  ],

  delete: (excelTemplateId: string) => [
    ...excelTemplateKeys.all,
    "delete",
    excelTemplateId,
  ],

  options: (queryParams: QueryParams = {}) => [
    ...excelTemplateKeys.all,
    "options",
    queryParams,
  ],

  getAllFields: (excelTemplateId: string) => [
    ...excelTemplateKeys.all,
    "get-all-fields",
    excelTemplateId,
  ],

  generateExcel: (excelTemplateId: string) => [
    ...excelTemplateKeys.all,
    "generate-excel",
    excelTemplateId,
  ],
};

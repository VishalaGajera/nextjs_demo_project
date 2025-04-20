export const subCasteKeys = {
  all: ["sub-caste"] as const,

  options: (castValue: string | null) => [
    ...subCasteKeys.all,
    castValue,
    "listing",
  ],

  listing: (requestBody: object = {}) =>
    [...subCasteKeys.all, "listing", requestBody] as const,

  add: () => [...subCasteKeys.all, "add"],

  get: (subCasteId: string) => [...subCasteKeys.all, "get", subCasteId],

  edit: (subCasteId: string) => [...subCasteKeys.all, "edit", subCasteId],

  delete: (subCasteId: string) => [...subCasteKeys.all, "delete", subCasteId],
};

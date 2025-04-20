export const designationKeys = {
  all: ["designation"] as const,

  listing: (requestBody: object = {}) =>
    [...designationKeys.all, "listing", requestBody] as const,

  add: () => [...designationKeys.all, "add"],

  edit: (designationId: string) => [
    ...designationKeys.all,
    "edit",
    designationId,
  ],

  get: (designationId: string) => [
    ...designationKeys.all,
    "get",
    designationId,
  ],

  delete: (designationId: string) => [
    ...designationKeys.all,
    "delete",
    designationId,
  ],

  options: (companyId?: string | null) => [
    ...designationKeys.all,
    "options",
    companyId,
  ],
};

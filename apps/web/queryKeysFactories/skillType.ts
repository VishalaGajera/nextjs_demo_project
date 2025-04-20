export const skillTypeKeys = {
  all: ["skillType"] as const,

  listing: (requestBody: object = {}) =>
    [...skillTypeKeys.all, "listing", requestBody] as const,

  add: () => [...skillTypeKeys.all, "add"],

  edit: (skillTypeId: string) => [...skillTypeKeys.all, "edit", skillTypeId],

  get: (skillTypeId: string) => [...skillTypeKeys.all, "get", skillTypeId],

  delete: (skillTypeId: string) => [
    ...skillTypeKeys.all,
    "delete",
    skillTypeId,
  ],

  options: (companyId: string) => [...skillTypeKeys.all, "options", companyId],
};

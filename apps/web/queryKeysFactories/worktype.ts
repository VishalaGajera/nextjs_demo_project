export const workTypeKeys = {
  all: ["workType"] as const,

  listing: (requestBody: object = {}) =>
    [...workTypeKeys.all, "listing", requestBody] as const,

  add: () => [...workTypeKeys.all, "add"],

  edit: (workTypeId: string) => [...workTypeKeys.all, "edit", workTypeId],

  get: (workTypeId: string) => [...workTypeKeys.all, "get", workTypeId],

  delete: (workTypeId: string) => [...workTypeKeys.all, "delete", workTypeId],

  options: (companyId?: string | null) => [
    ...workTypeKeys.all,
    "options",
    companyId,
  ],
};

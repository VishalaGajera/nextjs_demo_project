export const esicKeys = {
  all: ["esic"] as const,

  listing: (requestBody: object = {}) =>
    [...esicKeys.all, "listing", requestBody] as const,

  add: () => [...esicKeys.all, "add"],

  edit: (esicId: string) => [...esicKeys.all, "edit", esicId],

  get: (esicId: string) => [...esicKeys.all, "get", esicId],

  delete: (esicId: string) => [...esicKeys.all, "delete", esicId],

  options: () => [...esicKeys.all, "options"],
};

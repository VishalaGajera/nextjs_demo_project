export const bankKeys = {
  all: ["bank"] as const,

  listing: (requestBody: object = {}) =>
    [...bankKeys.all, "listing", requestBody] as const,

  add: () => [...bankKeys.all, "add"],

  edit: (bankId: string) => [...bankKeys.all, "edit", bankId],

  get: (bankId: string) => [...bankKeys.all, "get", bankId],

  delete: (bankId: string) => [...bankKeys.all, "delete", bankId],

  options: () => [...bankKeys.all, "options"],
};

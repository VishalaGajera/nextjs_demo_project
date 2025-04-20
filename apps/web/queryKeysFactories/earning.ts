export const earningKeys = {
  all: ["earning"] as const,

  listing: (requestBody: object = {}) =>
    [...earningKeys.all, "listing", requestBody] as const,

  add: () => [...earningKeys.all, "add"],

  edit: (earningId: string) => [...earningKeys.all, "edit", earningId],

  get: (earningId: string) => [...earningKeys.all, "get", earningId],

  delete: (earningId: string) => [...earningKeys.all, "delete", earningId],
};

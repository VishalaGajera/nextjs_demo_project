export const investmentSchemesKeys = {
  all: ["investmentSchemes"] as const,

  listing: (requestBody: object = {}) =>
    [...investmentSchemesKeys.all, "listing", requestBody] as const,

  add: () => [...investmentSchemesKeys.all, "add"],

  edit: (investmentSchemesId: string) => [
    ...investmentSchemesKeys.all,
    "edit",
    investmentSchemesId,
  ],

  get: (investmentSchemesId: string) => [
    ...investmentSchemesKeys.all,
    "get",
    investmentSchemesId,
  ],

  delete: (investmentSchemesId: string) => [
    ...investmentSchemesKeys.all,
    "delete",
    investmentSchemesId,
  ],
};

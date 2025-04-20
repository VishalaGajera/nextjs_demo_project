export const incomeTaxRegimeKeys = {
  all: ["IncomeTaxRegime"] as const,

  listing: (body: object = {}) => [...incomeTaxRegimeKeys.all, "listing", body],

  delete: (incomeTaxRegimeId: string) => [
    ...incomeTaxRegimeKeys.all,
    "delete",
    incomeTaxRegimeId,
  ],

  add: () => [...incomeTaxRegimeKeys.all, "add"],

  get: (incomeTaxRegimeId: string) => [
    ...incomeTaxRegimeKeys.all,
    "get",
    incomeTaxRegimeId,
  ],

  edit: (incomeTaxRegimeId: string) => [
    ...incomeTaxRegimeKeys.all,
    "edit",
    incomeTaxRegimeId,
  ],

  options: () => [...incomeTaxRegimeKeys.all, "options"],
};

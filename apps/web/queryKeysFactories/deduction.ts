export const deductionKeys = {
  all: ["deduction"] as const,

  listing: (requestBody: object = {}) =>
    [...deductionKeys.all, "listing", requestBody] as const,

  add: () => [...deductionKeys.all, "add"],

  edit: (deductionId: string) => [...deductionKeys.all, "edit", deductionId],

  get: (deductionId: string) => [...deductionKeys.all, "get", deductionId],

  delete: (deductionId: string) => [
    ...deductionKeys.all,
    "delete",
    deductionId,
  ],
};

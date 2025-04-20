export const professionalTaxesKeys = {
  all: ["professional-taxes"] as const,

  listing: (body: object = {}) => [
    ...professionalTaxesKeys.all,
    "listing",
    body,
  ],
  add: () => [...professionalTaxesKeys.all, "add"],
  get: (id: string) => [...professionalTaxesKeys.all, "get", id],
  update: (id: string) => [...professionalTaxesKeys.all, "update", id],
  delete: (id: string) => [...professionalTaxesKeys.all, "delete", id],
};

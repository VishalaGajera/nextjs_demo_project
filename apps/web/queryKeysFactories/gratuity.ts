export const gratuityKeys = {
  all: ["gratuity"] as const,

  listing: (body: object = {}) => [...gratuityKeys.all, "listing", body],
  add: () => [...gratuityKeys.all, "add"],
  get: (gratuityId: string) => [...gratuityKeys.all, "get", gratuityId],
  update: (gratuityId: string) => [...gratuityKeys.all, "update", gratuityId],
  delete: (gratuityId: string) => [...gratuityKeys.all, "delete", gratuityId],
};

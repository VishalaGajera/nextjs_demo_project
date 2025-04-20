export const basicDetailsKey = {
  all: ["basic-details-Key"] as const,

  get: (companyId: string) => [...basicDetailsKey.all, "get", companyId],

  edit: (companyId: string) => [...basicDetailsKey.all, "edit", companyId],
};

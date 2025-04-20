export const companyStatutoryKeys = {
  all: ["company-statutory-details"] as const,

  get: (companyId: string) => [...companyStatutoryKeys.all, "get", companyId],

  edit: (companyId: string) => [...companyStatutoryKeys.all, "edit", companyId],
};

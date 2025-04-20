export const companyKeys = {
  all: ["company"] as const,

  listing: (body: object = {}) => [...companyKeys.all, "listing", body],

  add: () => [...companyKeys.all, "add"],
};

export const companyBasicDetailsKeys = {
  all: [...companyKeys.all, "basic-details"] as const,

  edit: (companyId: string) => [
    ...companyBasicDetailsKeys.all,
    "edit",
    companyId,
  ],

  get: (companyId: string) => [
    ...companyBasicDetailsKeys.all,
    "get",
    companyId,
  ],
};

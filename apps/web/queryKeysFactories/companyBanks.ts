export const companyBankKeys = {
  all: ["companyBank"] as const,

  listing: (body: object = {}) => [...companyBankKeys.all, "listing", body],

  add: () => [...companyBankKeys.all, "add"],

  edit: (companyBankId: string) => [
    ...companyBankKeys.all,
    "edit",
    companyBankId,
  ],

  get: (companyBankId: string) => [
    ...companyBankKeys.all,
    "get",
    companyBankId,
  ],

  delete: (companyBankId: string) => [
    ...companyBankKeys.all,
    "delete",
    companyBankId,
  ],
};

export const authorisedPersonDetailsKey = {
  all: ["authorised-person-details"] as const,

  listing: (companyId: string) => [
    ...authorisedPersonDetailsKey.all,
    "listing",
    companyId,
  ],

  add: () => [...authorisedPersonDetailsKey.all, "add"],

  delete: (companyId: string) => [
    ...authorisedPersonDetailsKey.all,
    "delete",
    companyId,
  ],

  get: (personId: string) => [
    ...authorisedPersonDetailsKey.all,
    "get",
    personId,
  ],

  edit: (personId: string) => [
    ...authorisedPersonDetailsKey.all,
    "edit",
    personId,
  ],
};

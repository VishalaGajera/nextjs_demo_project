export const familyKeys = {
  all: ["family"] as const,

  listing: (body: object = {}) => [...familyKeys.all, "listing", body],

  edit: (familyId: string) => [...familyKeys.all, "edit", familyId],

  get: (familyId: string) => [...familyKeys.all, "get", familyId],

  delete: (familyId: string) => [...familyKeys.all, "delete", familyId],

  add: (employeeId: string) => [...familyKeys.all, "add", employeeId],
};

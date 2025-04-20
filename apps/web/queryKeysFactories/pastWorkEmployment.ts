export const pastWorkEmploymentKeys = {
  all: ["past-work-employment"] as const,

  listing: (body: object = {}) => [
    ...pastWorkEmploymentKeys.all,
    "listing",
    body,
  ],

  add: (employeeId: string) => [
    ...pastWorkEmploymentKeys.all,
    "add",
    employeeId,
  ],

  get: (pastWorkEmploymentId: string) => [
    ...pastWorkEmploymentKeys.all,
    "get",
    pastWorkEmploymentId,
  ],

  edit: (pastWorkEmploymentId: string) => [
    ...pastWorkEmploymentKeys.all,
    "edit",
    pastWorkEmploymentId,
  ],

  delete: (pastWorkEmploymentId: string) => [
    ...pastWorkEmploymentKeys.all,
    "delete",
    pastWorkEmploymentId,
  ],
};

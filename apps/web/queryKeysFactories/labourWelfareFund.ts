export const labourWelfareFundKeys = {
  all: ["labourWelfareFund"] as const,

  get: (lwfGroupId: string) => [
    ...labourWelfareFundKeys.all,
    "get",
    lwfGroupId,
  ],

  delete: (lwfGroupId: string) => [
    ...labourWelfareFundKeys.all,
    "delete",
    lwfGroupId,
  ],

  listing: (body: object = {}) => [
    ...labourWelfareFundKeys.all,
    "listing",
    body,
  ],

  add: () => [...labourWelfareFundKeys.all, "add"],

  edit: (lwfGroupId: string) => [
    ...labourWelfareFundKeys.all,
    "edit",
    lwfGroupId,
  ],
};

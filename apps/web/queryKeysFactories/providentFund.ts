export const providentFundKeys = {
  all: ["providentFund"] as const,

  listing: (requestBody: object = {}) =>
    [...providentFundKeys.all, "listing", requestBody] as const,

  add: () => [...providentFundKeys.all, "add"],

  edit: (providentFundId: string) => [
    ...providentFundKeys.all,
    "edit",
    providentFundId,
  ],

  get: (providentFundId: string) => [
    ...providentFundKeys.all,
    "get",
    providentFundId,
  ],

  delete: (providentFundId: string) => [
    ...providentFundKeys.all,
    "delete",
    providentFundId,
  ],

  options: () => [...providentFundKeys.all, "options"],
};

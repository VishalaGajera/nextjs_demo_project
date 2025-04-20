export const contributionKeys = {
  all: ["contribution"] as const,

  listing: (requestBody: object = {}) =>
    [...contributionKeys.all, "listing", requestBody] as const,

  add: () => [...contributionKeys.all, "add"],

  edit: (contributionId: string) => [
    ...contributionKeys.all,
    "edit",
    contributionId,
  ],

  get: (contributionId: string) => [
    ...contributionKeys.all,
    "get",
    contributionId,
  ],

  delete: (contributionId: string) => [
    ...contributionKeys.all,
    "delete",
    contributionId,
  ],
};

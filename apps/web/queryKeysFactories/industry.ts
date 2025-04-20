export const industryKeys = {
  all: ["industry"] as const,

  listing: (requestBody: object = {}) =>
    [...industryKeys.all, "listing", requestBody] as const,

  add: () => [...industryKeys.all, "add"],

  edit: (industryId: string) => [...industryKeys.all, "edit", industryId],

  get: (industryId: string) => [...industryKeys.all, "get", industryId],

  delete: (industryId: string) => [...industryKeys.all, "delete", industryId],

  options: () => [...industryKeys.all, "options"],
};

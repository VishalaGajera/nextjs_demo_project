export const gradeKeys = {
  all: ["grade"] as const,

  listing: (requestBody: object = {}) =>
    [...gradeKeys.all, "listing", requestBody] as const,

  add: () => [...gradeKeys.all, "add"],

  edit: (gradeId: string) => [...gradeKeys.all, "edit", gradeId],

  get: (gradeId: string) => [...gradeKeys.all, "get", gradeId],

  delete: (gradeId: string) => [...gradeKeys.all, "delete", gradeId],

  options: (companyId: string) => [...gradeKeys.all, "options", companyId],
};

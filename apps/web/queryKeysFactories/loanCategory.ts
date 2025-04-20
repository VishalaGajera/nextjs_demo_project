export const loanCategoryKeys = {
  all: ["loan-categories"] as const,

  listing: (requestBody: object = {}) =>
    [...loanCategoryKeys.all, "listing", requestBody] as const,

  add: () => [...loanCategoryKeys.all, "add"],

  edit: (loanCategoryId: string) => [
    ...loanCategoryKeys.all,
    "edit",
    loanCategoryId,
  ],

  get: (loanCategoryId: string) => [
    ...loanCategoryKeys.all,
    "get",
    loanCategoryId,
  ],

  delete: (loanCategoryId: string) => [
    ...loanCategoryKeys.all,
    "delete",
    loanCategoryId,
  ],

  options: () => [...loanCategoryKeys.all, "options"],
};

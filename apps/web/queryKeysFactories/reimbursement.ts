export const reimbursementKeys = {
  all: ["reimbursement"] as const,

  listing: (requestBody: object = {}) =>
    [...reimbursementKeys.all, "listing", requestBody] as const,

  add: () => [...reimbursementKeys.all, "add"],

  edit: (reimbursementId: string) => [
    ...reimbursementKeys.all,
    "edit",
    reimbursementId,
  ],

  get: (reimbursementId: string) => [
    ...reimbursementKeys.all,
    "get",
    reimbursementId,
  ],

  delete: (reimbursementId: string) => [
    ...reimbursementKeys.all,
    "delete",
    reimbursementId,
  ],
};

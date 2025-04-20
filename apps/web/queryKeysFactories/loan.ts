export const loanKeys = {
  all: ["loan"] as const,

  listing: (body: object = {}) => [...loanKeys.all, "listing", body],

  add: (currentDate: string) => [...loanKeys.all, "add", currentDate],

  edit: (loanId: string) => [...loanKeys.all, "edit", loanId],

  get: (loanId: string) => [...loanKeys.all, "get", loanId],

  delete: (loanId: string) => [...loanKeys.all, "delete", loanId],

  status: (loanId: string, status: string) => [
    ...loanKeys.all,
    "delete",
    loanId,
    status,
  ],
};

export const loanPolicyKeys = {
  all: ["loan-policy"] as const,

  listing: (body: object = {}) => [...loanPolicyKeys.all, "listing", body],

  add: () => [...loanPolicyKeys.all, "add"],

  edit: (policyId: string) => [...loanPolicyKeys.all, "edit", policyId],

  get: (policyId: string) => [...loanPolicyKeys.all, "get", policyId],

  delete: (policyId: string) => [...loanPolicyKeys.all, "delete", policyId],

  options: (companyId: string) => [...loanPolicyKeys.all, "options", companyId],

  employeeOptions: (companyId: string, currentDate: string) => [
    ...loanPolicyKeys.all,
    "options",
    companyId,
    currentDate,
  ],
};

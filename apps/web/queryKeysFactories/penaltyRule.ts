export const penaltyRuleKeys = {
  all: ["penalty-rule"] as const,

  listing: (body: object = {}) => [...penaltyRuleKeys.all, "listing", body],

  add: () => [...penaltyRuleKeys.all, "add"],

  get: (penaltyRulesId: string) => [
    ...penaltyRuleKeys.all,
    "get",
    penaltyRulesId,
  ],

  edit: (penaltyRulesId: string) => [
    ...penaltyRuleKeys.all,
    "edit",
    penaltyRulesId,
  ],

  delete: (penaltyRulesId: string) => [
    ...penaltyRuleKeys.all,
    "delete",
    penaltyRulesId,
  ],

  options: (companyId?: string | null) => [
    ...penaltyRuleKeys.all,
    "options",
    companyId,
  ],
};

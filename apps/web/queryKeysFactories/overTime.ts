export const overTimeKeys = {
  all: ["Overtime"] as const,

  listing: (body: object = {}) => [...overTimeKeys.all, "listing", body],

  add: () => [...overTimeKeys.all, "add"] as const,

  get: (overTimeRulesId: string) => [
    ...overTimeKeys.all,
    "get",
    overTimeRulesId,
  ],

  edit: (overTimeRulesId: string) => [
    ...overTimeKeys.all,
    "edit",
    overTimeRulesId,
  ],

  delete: (overTimeRulesId: string) => [
    ...overTimeKeys.all,
    "delete",
    overTimeRulesId,
  ],

  options: (companyId?: string | null) => [
    ...overTimeKeys.all,
    "options",
    companyId,
  ],
};

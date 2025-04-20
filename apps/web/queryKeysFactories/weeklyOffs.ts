export const weeklyOffsKeys = {
  all: ["weekly-offs"] as const,

  listing: (body: object = {}) => [...weeklyOffsKeys.all, "listing", body],

  add: () => [...weeklyOffsKeys.all, "add"],

  get: (weeklyOffId: string) => [...weeklyOffsKeys.all, "get", weeklyOffId],

  edit: (weeklyOffId: string) => [...weeklyOffsKeys.all, "edit", weeklyOffId],

  delete: (weeklyOffsId: string) => [
    ...weeklyOffsKeys.all,
    "delete",
    weeklyOffsId,
  ],

  options: (companyId?: string | null) => [
    ...weeklyOffsKeys.all,
    "options",
    companyId,
  ],
};

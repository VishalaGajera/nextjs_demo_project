export const statutoryKeys = {
  all: ["statutory"] as const,

  edit: (statutoryId: string) => [...statutoryKeys.all, "edit", statutoryId],

  get: (statutoryId: string) => [...statutoryKeys.all, "get", statutoryId],

  history: (employeeId: string) => [...statutoryKeys.all, "get", employeeId],
};

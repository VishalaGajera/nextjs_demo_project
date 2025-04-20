export const employeeDraftKeys = {
  all: ["employee-draft"] as const,

  add: () => [...employeeDraftKeys.all, "add"],

  edit: (employeeId: string) => [...employeeDraftKeys.all, "edit", employeeId],

  get: (employeeId: string) => [...employeeDraftKeys.all, "get", employeeId],

  delete: (employeeId: string) => [
    ...employeeDraftKeys.all,
    "delete",
    employeeId,
  ],
};

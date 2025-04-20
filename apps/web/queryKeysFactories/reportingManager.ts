export const reportingManagerKeys = {
  all: ["reporting_manager"] as const,

  get: (employeeId: string) => [...reportingManagerKeys.all, "get", employeeId],

  options: (companyId?: string | null) => [
    ...reportingManagerKeys.all,
    "options",
    companyId,
  ],
};

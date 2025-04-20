export const paymentHistory = {
  all: ["paymentHistory"] as const,

  get: (employeeId: string) => [...paymentHistory.all, "get", employeeId],
};

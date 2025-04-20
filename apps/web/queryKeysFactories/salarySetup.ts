export const salarySetupkeys = {
  all: ["salary-setup"] as const,

  list: () => [...salarySetupkeys.all, "list"],

  get: (employeeId: string) => [...salarySetupkeys.all, "get", employeeId],

  post: (employeeId: string) => [...salarySetupkeys.all, "post", employeeId],
};

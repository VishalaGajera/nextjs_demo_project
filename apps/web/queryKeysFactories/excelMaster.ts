export const excelMasterKeys = {
  all: ["excel-master"] as const,

  options: () => [...excelMasterKeys.all, "options"],

  get: (excelMasterId?: string) => [
    ...excelMasterKeys.all,
    "get",
    excelMasterId,
  ],
};

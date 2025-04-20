export const salaryStructureKeys = {
  all: ["salary-structure"] as const,

  listing: (body: object = {}) => [...salaryStructureKeys.all, "list", body],

  add: () => [...salaryStructureKeys.all, "add"],

  get: (ssId: string) => [...salaryStructureKeys.all, "get", ssId],

  update: (ssId: string) => [...salaryStructureKeys.all, "update", ssId],

  delete: (ssId: string) => [...salaryStructureKeys.all, "delete", ssId],

  options: (ssId: string) => [...salaryStructureKeys.all, "options", ssId],

  rangeList: (ssId: string, interval: string) => [
    ...salaryStructureKeys.all,
    "range-list",
    ssId,
    interval,
  ],

  editRangeList: (ssId: string, interval: string) => [
    ...salaryStructureKeys.all,
    "edit",
    ssId,
    interval,
  ],

  getEarningComponentList: () => [
    ...salaryStructureKeys.all,
    "earning-component-list",
  ],

  getSalaryComponentsList: (
    ssId: string,
    interval: string,
    salaryRangeId: string
  ) => [
    ...salaryStructureKeys.all,
    "component-list",
    ssId,
    interval,
    salaryRangeId,
  ],

  updateSalaryComponent: () => [...salaryStructureKeys.all, "component-update"],

  customList: (ssId: string, interval: string) => [
    ...salaryStructureKeys.all,
    "custom-list",
    ssId,
    interval,
  ],

  getCustomSalaryById: (ssId: string, csId: string) => [
    ...salaryStructureKeys.all,
    "get-custom-list",
    ssId,
    csId,
  ],

  editCustomSalaryComponent: (ssId: string, csId: string) => [
    ...salaryStructureKeys.all,
    "edit-custom-component-",
    ssId,
    csId,
  ],

  deleteCustomSalary: (ssId: string, csId: string) => [
    ...salaryStructureKeys.all,
    "custom-component-delete",
    ssId,
    csId,
  ],

  addCustomSalaryComponent: (ssId: string) => [
    ...salaryStructureKeys.all,
    "add-custom-component",
    ssId,
  ],

  salaryStructureNameOptions: (companyId: string) => [
    ...salaryStructureKeys.all,
    "options",
    "salaryStructureNameOptions",
    companyId,
  ],

  salaryStructureOptions: (ssId: string) => [
    ...salaryStructureKeys.all,
    "options",
    "salaryStructureOptions",
    ssId,
  ],

  getSalaryCustomDetails: (ssId: string, customId: string) => [
    ...salaryStructureKeys.all,
    "options",
    "getSalaryCustomDetails",
    ssId,
    customId,
  ],

  getSalaryRangesDetails: (ssId: string, rangeId: string, interval: string) => [
    ...salaryStructureKeys.all,
    "options",
    "salaryRangesDetails",
    ssId,
    rangeId,
    interval,
  ],
};

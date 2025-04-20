export const employeeBankShiftDetailKeys = {
  all: ["employee-bank-shift"] as const,

  listing: (body: object = {}) => [
    ...employeeBankShiftDetailKeys.all,
    "listing",
    body,
  ],

  add: () => [...employeeBankShiftDetailKeys.all, "add"],

  edit: (bankshiftId: string) => [
    ...employeeBankShiftDetailKeys.all,
    "edit",
    bankshiftId,
  ],

  get: (bankshiftId: string) => [
    ...employeeBankShiftDetailKeys.all,
    "get",
    bankshiftId,
  ],

  delete: (bankshiftId: string) => [
    ...employeeBankShiftDetailKeys.all,
    "delete",
    bankshiftId,
  ],

  options: (companyId?: string | null) => [
    ...employeeBankShiftDetailKeys.all,
    "options",
    companyId,
  ],
};

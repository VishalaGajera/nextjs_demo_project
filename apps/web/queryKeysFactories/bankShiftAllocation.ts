export const bankShiftAllocationKeys = {
  all: ["bank-shift-allocation"] as const,

  listing: (body: object = {}) => [
    ...bankShiftAllocationKeys.all,
    "listing",
    body,
  ],

  updateBankShift: (employeeIds: string[]) => [
    ...bankShiftAllocationKeys.all,
    "edit",
    employeeIds,
  ],
};

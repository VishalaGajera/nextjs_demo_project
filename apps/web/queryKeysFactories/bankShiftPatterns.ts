export const bankShiftPatternsKeys = {
  all: ["bank-shift-pattern"] as const,

  listing: (body: object = {}) => [
    ...bankShiftPatternsKeys.all,
    "listing",
    body,
  ],

  add: () => [...bankShiftPatternsKeys.all, "add"],

  get: (bankShiftPatternId: string) => [
    ...bankShiftPatternsKeys.all,
    "get",
    bankShiftPatternId,
  ],

  edit: (bankShiftPatternId: string) => [
    ...bankShiftPatternsKeys.all,
    "edit",
    bankShiftPatternId,
  ],

  delete: (bankShiftPatternId: string) => [
    ...bankShiftPatternsKeys.all,
    "delete",
    bankShiftPatternId,
  ],
};

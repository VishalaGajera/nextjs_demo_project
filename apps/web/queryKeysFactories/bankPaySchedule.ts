export const bankPayScheduleKeys = {
  all: ["bank-pay-schedule"] as const,

  listing: (body: object = {}) => [...bankPayScheduleKeys.all, "listing", body],

  add: () => [...bankPayScheduleKeys.all, "add"],

  get: (bankPayScheduleId: string) => [
    ...bankPayScheduleKeys.all,
    "get",
    bankPayScheduleId,
  ],

  edit: (bankPayScheduleId: string) => [
    ...bankPayScheduleKeys.all,
    "edit",
    bankPayScheduleId,
  ],

  delete: (bankPayScheduleId: string) => [
    ...bankPayScheduleKeys.all,
    "delete",
    bankPayScheduleId,
  ],
};

export const payScheduleSetupKeys = {
  all: ["pay-schedule-setup"] as const,

  listing: (body: object = {}) => [
    ...payScheduleSetupKeys.all,
    "listing",
    body,
  ],

  add: () => [...payScheduleSetupKeys.all, "add"],

  get: (payScheduleSetupId: string) => [
    ...payScheduleSetupKeys.all,
    "get",
    payScheduleSetupId,
  ],

  edit: (payScheduleSetupId: string) => [
    ...payScheduleSetupKeys.all,
    "edit",
    payScheduleSetupId,
  ],

  delete: (payScheduleSetupId: string) => [
    ...payScheduleSetupKeys.all,
    "delete",
    payScheduleSetupId,
  ],

  option: (companyId: string) => [
    ...payScheduleSetupKeys.all,
    "option",
    companyId,
  ],
};

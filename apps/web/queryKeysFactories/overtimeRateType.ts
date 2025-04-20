export const overtimeRateTypeKeys = {
  all: ["overtime-rate-type"] as const,

  listing: (body: object = {}) => [
    ...overtimeRateTypeKeys.all,
    "listing",
    body,
  ],

  add: () => [...overtimeRateTypeKeys.all, "add"],

  get: (overtimeRateTypeId: string) => [
    ...overtimeRateTypeKeys.all,
    "get",
    overtimeRateTypeId,
  ],

  edit: (overtimeRateTypeId: string) => [
    ...overtimeRateTypeKeys.all,
    "edit",
    overtimeRateTypeId,
  ],

  delete: (overtimeRateTypeId: string) => [
    ...overtimeRateTypeKeys.all,
    "delete",
    overtimeRateTypeId,
  ],
};

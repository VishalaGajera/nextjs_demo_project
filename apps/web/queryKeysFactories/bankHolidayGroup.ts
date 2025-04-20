export const bankHolidayGroupKeys = {
  all: ["bank-holiday-group"] as const,

  listing: () => [...bankHolidayGroupKeys.all, "listing"] as const,
};

export const bankHolidayKeys = {
  all: ["bank-holiday"] as const,

  listing: (requestBody: object = {}) =>
    [...bankHolidayKeys.all, "listing", requestBody] as const,

  add: () => [...bankHolidayKeys.all, "add"],

  get: (bankHolidayId: string) => [
    ...bankHolidayKeys.all,
    "get",
    bankHolidayId,
  ],

  edit: (companyId: string, bankHolidayId: string) => [
    ...bankHolidayKeys.all,
    "edit",
    companyId,
    bankHolidayId,
  ],

  delete: (companyId: string, bankHolidayId: string) => [
    ...bankHolidayKeys.all,
    "delete",
    companyId,
    bankHolidayId,
  ],

  getHolidayByYearMonth: (companyId: string, yearMonth: string) => [
    ...bankHolidayKeys.all,
    "get",
    companyId,
    yearMonth,
  ],
};

export const bankHolidayYearKeys = {
  all: ["bank-holiday-year"] as const,

  add: () => [...bankHolidayYearKeys.all, "add"],

  listing: (requestBody: object = {}) =>
    [...bankHolidayYearKeys.all, "listing", requestBody] as const,
};

export const holidayGroupKeys = {
  all: ["holidayGroup"] as const,

  listing: (requestBody: object = {}) =>
    [...holidayGroupKeys.all, "listing", requestBody] as const,

  add: () => [...holidayGroupKeys.all, "add"],

  get: () => [...holidayGroupKeys.all, "get"],

  delete: (holidayGroupId: string) => [
    ...holidayGroupKeys.all,
    "delete",
    holidayGroupId,
  ],
};

export const holidayKeys = {
  all: ["holiday"] as const,

  listing: (requestBody: object = {}) =>
    [...holidayKeys.all, "listing", requestBody] as const,

  add: () => [...holidayKeys.all, "add"],

  get: (holidayId: string) => [...holidayKeys.all, "get", holidayId],

  edit: (holidayId: string) => [...holidayKeys.all, "edit", holidayId],

  delete: (holidayId: string) => [...holidayKeys.all, "delete", holidayId],

  options: (companyId?: string | null) => [
    ...holidayKeys.all,
    "options",
    companyId,
  ],
};
export const holidayYearKeys = {
  all: ["holidayYear"] as const,

  add: () => [...holidayYearKeys.all, "add"],

  listing: (requestBody: object = {}) =>
    [...holidayYearKeys.all, "listing", requestBody] as const,
};

export const holidayMasterKeys = {
  all: ["holiday-master"] as const,

  listing: (requestBody: object = {}) =>
    [...holidayMasterKeys.all, "listing", requestBody] as const,

  add: () => [...holidayMasterKeys.all, "add"],

  delete: (holidayId: string) => [
    ...holidayMasterKeys.all,
    "delete",
    holidayId,
  ],

  get: (holidayId: string) => [...holidayMasterKeys.all, "get", holidayId],

  edit: (holidayId: string) => [...holidayMasterKeys.all, "edit", holidayId],

  options: () => [...holidayMasterKeys.all, "options"],
};

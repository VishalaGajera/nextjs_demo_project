export const overTimeRequestKeys = {
  all: ["OvertimeRequest"] as const,

  listing: (body: object = {}) => [...overTimeRequestKeys.all, "listing", body],

  add: () => [...overTimeRequestKeys.all, "add"],

  edit: (OTRequestId: string) => [
    ...overTimeRequestKeys.all,
    "edit",
    OTRequestId,
  ],

  get: (employeeId: string, selectDate: string) => [
    ...overTimeRequestKeys.all,
    "get",
    employeeId,
    selectDate,
  ],

  getOne: (employeeId: string) => [
    ...overTimeRequestKeys.all,
    "getOne",
    employeeId,
  ],

  status: (OTRequestId: string) => [
    ...overTimeRequestKeys.all,
    "status",
    OTRequestId,
  ],
};

export const leaveOverviewKey = {
  all: ["leave-overview-employee"] as const,

  listing: (body: object = {}) => [...leaveOverviewKey.all, "listing", body],

  getLeaveEmployee: (employeeId: string) => [
    ...leaveOverviewKey.all,
    "employeeDetails",
    employeeId,
  ],

  getLeaveBalances: (employeeId: string, from_date: string) => [
    ...leaveOverviewKey.all,
    "details",
    employeeId,
    from_date,
  ],

  getHistory: (employeeId: string, leaveTypeId: string, from_date: string) => [
    ...leaveOverviewKey.all,
    "history",
    employeeId,
    leaveTypeId,
    from_date,
  ],

  getRequestList: (employeeId: string, from_date: string) => [
    ...leaveOverviewKey.all,
    "get",
    employeeId,
    from_date,
  ],

  getRequestHistory: (employeeId: string, from_date: string) => [
    ...leaveOverviewKey.all,
    "getHistoryList",
    employeeId,
    from_date,
  ],

  getLeaveRequest: (leaveRequestId: string, selectedEmployeeId: string) => [
    ...leaveOverviewKey.all,
    "get",
    leaveRequestId,
    selectedEmployeeId,
  ],

  getLeaveRequestHistory: (
    leaveRequestId: string,
    selectedEmployeeId: string
  ) => [...leaveOverviewKey.all, "get", leaveRequestId, selectedEmployeeId],

  add: (employeeId: string) => [...leaveOverviewKey.all, "add", employeeId],

  validate: (employeeId: string, leaveRequestId?: string) => [
    ...leaveOverviewKey.all,
    "validate",
    employeeId,
    leaveRequestId,
  ],

  edit: (selectedEmployeeId: string, leaveRequestId: string) => [
    ...leaveOverviewKey.all,
    "edit",
    selectedEmployeeId,
    leaveRequestId,
  ],

  editStatus: (
    selectedEmployeeId: string,
    leaveRequestId: string,
    status?: "approved" | "rejected" | "cancelled"
  ) => [
    ...leaveOverviewKey.all,
    "editStatus",
    selectedEmployeeId,
    leaveRequestId,
    status,
  ],

  options: (selectedEmployeeId: string) => [
    ...leaveOverviewKey.all,
    "options",
    selectedEmployeeId,
  ],
};

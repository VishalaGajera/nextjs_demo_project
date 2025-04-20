export const approvalLeaveKeys = {
  all: ["approval-leave"] as const,

  listing: (body: object = {}) => [...approvalLeaveKeys.all, "listing", body],

  approveBulkLeave: (leaveRequestIds: string[]) => [
    ...approvalLeaveKeys.all,
    "approve",
    leaveRequestIds,
  ],
};

export const approvalOvertimeKeys = {
  all: ["approval-overtime"] as const,

  listing: (body: object = {}) => [
    ...approvalOvertimeKeys.all,
    "listing",
    body,
  ],

  approveBulkOvertime: (overtimeRequestIds: string[]) => [
    ...approvalOvertimeKeys.all,
    "approve",
    overtimeRequestIds,
  ],
};

import { LEAVE_OVERVIEW_BASE_URL } from "../route";

export const LEAVE_HISTORY_ROUTES = {
  getLeaveHistory: (selectedEmployeeId: string, from_date: string) =>
    `${LEAVE_OVERVIEW_BASE_URL}/${selectedEmployeeId}/leave-requests/list?fromDate=${from_date}&viewType=history`,

  getLeaveHistoryItemUrl: (
    selectedEmployeeId: string,
    leaveRequestId: string
  ) =>
    `${LEAVE_OVERVIEW_BASE_URL}/${selectedEmployeeId}/leave-history/${leaveRequestId}`,
};

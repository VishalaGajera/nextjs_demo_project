import { TRANSACTIONS_BASE_URL } from "../../routes";
import { LEAVE_BASE_URL } from "../route";
export const LEAVE_OVERVIEW_BASE_URL = `${TRANSACTIONS_BASE_URL}/${LEAVE_BASE_URL}/leave-overview/employee`;

export const LEAVE_OVERVIEW_ROUTES = {
  listing: () => `${LEAVE_OVERVIEW_BASE_URL}/list`,

  getLeaveEmployeeDetails: (selectedEmployeeId: string) =>
    `${LEAVE_OVERVIEW_BASE_URL}/${selectedEmployeeId}`,

  getLeaveBalances: (selectedEmployeeId: string, from_date: string) =>
    `${LEAVE_OVERVIEW_BASE_URL}/${selectedEmployeeId}/leave-balances?fromDate=${from_date}`,

  getHistory: (employeeId: string, leaveTypeId: string, from_date: string) =>
    `${LEAVE_OVERVIEW_BASE_URL}/${employeeId}/leave-balances/history/${leaveTypeId}?fromDate=${from_date}`,

  post: (selectedEmployeeId: string) =>
    `${LEAVE_OVERVIEW_BASE_URL}/${selectedEmployeeId}/leave-requests`,

  validate: (selectedEmployeeId: string, leaveRequestId?: string) =>
    `${LEAVE_OVERVIEW_BASE_URL}/${selectedEmployeeId}/leave-requests/validation${
      leaveRequestId ? `?leaveRequestId=${leaveRequestId}` : ""
    }`,

  patch: (selectedEmployeeId: string, leaveRequestId: string) =>
    `${LEAVE_OVERVIEW_BASE_URL}/${selectedEmployeeId}/leave-requests/${leaveRequestId}`,

  changeStatus: (
    selectedEmployeeId: string,
    leaveRequestId: string,
    status?: "approved" | "rejected" | "cancelled"
  ) =>
    `${LEAVE_OVERVIEW_BASE_URL}/${selectedEmployeeId}/leave-requests/${leaveRequestId}/status-change/${status}`,

  pendingList: (selectedEmployeeId: string, from_date: string) =>
    `${LEAVE_OVERVIEW_BASE_URL}/${selectedEmployeeId}/leave-requests/list?fromDate=${from_date}&viewType=pending`,

  getLeaveRequestUrl: (selectedEmployeeId: string, leaveRequestId: string) =>
    `${LEAVE_OVERVIEW_BASE_URL}/${selectedEmployeeId}/leave-requests/${leaveRequestId}`,

  getLeaveRequestHistoryUrl: (
    selectedEmployeeId: string,
    leaveRequestId: string
  ) =>
    `${LEAVE_OVERVIEW_BASE_URL}/${selectedEmployeeId}/leave-requests/${leaveRequestId}/history`,

  getLeaveBalanceYearOptions: (selectedEmployeeId: string) =>
    `${LEAVE_OVERVIEW_BASE_URL}/${selectedEmployeeId}/leave-balances/options`,
};

import { DateTime } from "luxon";
import { TRANSACTIONS_BASE_URL } from "../../routes";
import { LEAVE_BASE_URL } from "../route";

export const LEAVE_BALANCE_SUMMARY_BASE_URL = `${TRANSACTIONS_BASE_URL}/${LEAVE_BASE_URL}/leave-balance-summary/employee`;

export const LEAVE_BALANCE_SUMMARY_ROUTES = {
  listing: () =>
    `${LEAVE_BALANCE_SUMMARY_BASE_URL}/list?currentDate=${DateTime.now().toISODate()}`,

  get: (employeeId: string) =>
    `${LEAVE_BALANCE_SUMMARY_BASE_URL}/${employeeId}?currentDate=${DateTime.now().toISODate()}`,

  edit: (employeeId: string) =>
    `${LEAVE_BALANCE_SUMMARY_BASE_URL}/${employeeId}`,
};

import { LIST } from "../../../../routes";
import { TRANSACTIONS_BASE_URL } from "../../routes";
import { ATTENDANCE_BASE_URL } from "../routes";

export const ATTENDANCE_OVERVIEW_BASE_URL = `${TRANSACTIONS_BASE_URL}/${ATTENDANCE_BASE_URL}/attendance-overview`;

export const ATTENDANCE_OVERVIEW_ROUTES = {
  post: `${ATTENDANCE_OVERVIEW_BASE_URL}/logs`,

  listing: (currentDate: string) =>
    `${ATTENDANCE_OVERVIEW_BASE_URL}/employee/${LIST}?currentDate=${currentDate}`,

  get: (selectedEmployeeId: string, currentDate: string) =>
    `${ATTENDANCE_OVERVIEW_BASE_URL}/employee/${selectedEmployeeId}/logs?date=${currentDate}`,

  getMeta: (
    selectedEmployeeId: string,
    currentDate: string,
    currentFullDate: string
  ) =>
    `${ATTENDANCE_OVERVIEW_BASE_URL}/employee/${selectedEmployeeId}/meta-data?datePeriod=${currentDate}&currentDate=${currentFullDate}`,
};

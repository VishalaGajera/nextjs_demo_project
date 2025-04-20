import { LIST } from "../../../../routes";
import { TRANSACTIONS_BASE_URL } from "../../routes";
import { ATTENDANCE_BASE_URL } from "../routes";

export const BULK_ATTENDANCE_BASE_URL = `${TRANSACTIONS_BASE_URL}/${ATTENDANCE_BASE_URL}/bulk-attendance`;

export const BULK_ATTENDANCE_ROUTES = {
  post: `${BULK_ATTENDANCE_BASE_URL}/logs`,

  listing: (currentDate: string) =>
    `${BULK_ATTENDANCE_BASE_URL}/employee/${LIST}?current_date=${currentDate}`,
};

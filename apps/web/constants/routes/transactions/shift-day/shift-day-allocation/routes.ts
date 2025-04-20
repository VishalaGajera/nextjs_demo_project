import { LIST } from "../../../../routes";
import { TRANSACTIONS_BASE_URL } from "../../routes";
import { SHIFT_DAY_BASE_URL } from "../routes";

export const SHIFT_DAY_ALLOCATION_BASE_URL = `${TRANSACTIONS_BASE_URL}/${SHIFT_DAY_BASE_URL}/shift-day-allocation`;

export const SHIFT_DAY_ALLOCATION_ROUTES = {
  listing: (currentDate: string) =>
    `${SHIFT_DAY_ALLOCATION_BASE_URL}/employee/${LIST}?current_date=${currentDate}`,

  postHolidayGroup: `${SHIFT_DAY_ALLOCATION_BASE_URL}/holiday-group`,

  postShiftType: `${SHIFT_DAY_ALLOCATION_BASE_URL}/shift-type`,

  postWeeklyOffType: `${SHIFT_DAY_ALLOCATION_BASE_URL}/weekly-off-type`,
};

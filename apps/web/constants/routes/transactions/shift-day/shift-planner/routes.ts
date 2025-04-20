import { LIST } from "../../../../routes";
import { TRANSACTIONS_BASE_URL } from "../../routes";
import { SHIFT_DAY_BASE_URL } from "../routes";

export const SHIFT_PLANNER_BASE_URL = `${TRANSACTIONS_BASE_URL}/${SHIFT_DAY_BASE_URL}/shift-planner`;

export const SHIFT_PLANNER_ROUTES = {
  listing: (datePeriodVar: string, currentDate: string) =>
    `${SHIFT_PLANNER_BASE_URL}/${LIST}?datePeriod=${datePeriodVar}&currentDate=${currentDate}`,

  post: (currentDate: string) =>
    `${SHIFT_PLANNER_BASE_URL}/assign-shift-type?currentDate=${currentDate}`,
};

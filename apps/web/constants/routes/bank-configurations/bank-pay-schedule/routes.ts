import { LIST } from "../../../routes";
import { BANK_CONFIGURATIONS_BASE_URL } from "../routes";

export const BANK_PAY_SCHEDULE_ROUTES_BASE_URL = `${BANK_CONFIGURATIONS_BASE_URL}/bank-pay-schedule-group`;

export const BANK_PAY_SCHEDULE_ROUTES = {
  listing: `${BANK_PAY_SCHEDULE_ROUTES_BASE_URL}/${LIST}`,

  post: BANK_PAY_SCHEDULE_ROUTES_BASE_URL,

  get: (bankPayScheduleId: string) =>
    `${BANK_PAY_SCHEDULE_ROUTES_BASE_URL}/${bankPayScheduleId}`,

  patch: (bankPayScheduleId: string) =>
    `${BANK_PAY_SCHEDULE_ROUTES_BASE_URL}/${bankPayScheduleId}`,

  delete: (bankPayScheduleId: string) =>
    `${BANK_PAY_SCHEDULE_ROUTES_BASE_URL}/${bankPayScheduleId}`,
};

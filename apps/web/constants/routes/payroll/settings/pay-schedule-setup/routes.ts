import { LIST, OPTIONS } from "../../../../routes";
import { SETTINGS_ROUTES_BASE_URL } from "../routes";

export const PAY_SCHEDULE_SETUP_ROUTES_BASE_URL = `${SETTINGS_ROUTES_BASE_URL}/pay-schedule-setup`;

export const PAY_SCHEDULE_SETUP_ROUTES = {
  listing: `${PAY_SCHEDULE_SETUP_ROUTES_BASE_URL}/${LIST}`,

  post: PAY_SCHEDULE_SETUP_ROUTES_BASE_URL,

  get: (payScheduleSetupId: string) =>
    `${PAY_SCHEDULE_SETUP_ROUTES_BASE_URL}/${payScheduleSetupId}`,

  patch: (payScheduleSetupId: string) =>
    `${PAY_SCHEDULE_SETUP_ROUTES_BASE_URL}/${payScheduleSetupId}`,

  delete: (payScheduleSetupId: string) =>
    `${PAY_SCHEDULE_SETUP_ROUTES_BASE_URL}/${payScheduleSetupId}`,

  options: (companyId: string) =>
    `${PAY_SCHEDULE_SETUP_ROUTES_BASE_URL}/${OPTIONS}/${companyId}`,
};

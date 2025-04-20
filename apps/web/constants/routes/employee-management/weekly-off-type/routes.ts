import { LIST, OPTIONS } from "../../../routes";
import { EMPLOYEE_MANAGEMENT_ROUTES_BASE_URL } from "../routes";

export const WEEKLY_OFF_ROUTES_BASE_URL = `${EMPLOYEE_MANAGEMENT_ROUTES_BASE_URL}/weekly-off-type`;

export const WEEKLY_OFF_ROUTES = {
  post: WEEKLY_OFF_ROUTES_BASE_URL,

  delete: (weeklyOffsId: string) =>
    `${WEEKLY_OFF_ROUTES_BASE_URL}/${weeklyOffsId}`,

  listing: `${WEEKLY_OFF_ROUTES_BASE_URL}/${LIST}`,

  patch: (weeklyOffsId: string) =>
    `${WEEKLY_OFF_ROUTES_BASE_URL}/${weeklyOffsId}`,

  get: (weeklyOffsId: string) =>
    `${WEEKLY_OFF_ROUTES_BASE_URL}/${weeklyOffsId}`,

  options: (companyId: string | null | undefined) =>
    `${WEEKLY_OFF_ROUTES_BASE_URL}/${OPTIONS}/${companyId}`,
};

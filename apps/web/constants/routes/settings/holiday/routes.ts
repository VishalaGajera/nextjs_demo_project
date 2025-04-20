import { LIST, OPTIONS } from "../../../routes";
import { SETTINGS_BASE_URL } from "../routes";

export const HOLIDAY_ROUTES_BASE_URL = `${SETTINGS_BASE_URL}/holiday`;

export const HOLIDAY_ROUTES = {
  post: HOLIDAY_ROUTES_BASE_URL,

  delete: (holidayId: string) => `${HOLIDAY_ROUTES_BASE_URL}/${holidayId}`,

  listing: `${HOLIDAY_ROUTES_BASE_URL}/${LIST}`,

  patch: (holidayId: string) => `${HOLIDAY_ROUTES_BASE_URL}/${holidayId}`,

  get: (holidayId: string) => `${HOLIDAY_ROUTES_BASE_URL}/${holidayId}`,

  holidayYearsOptions: `${HOLIDAY_ROUTES_BASE_URL}/year/${OPTIONS}`,

  options: (year: string) =>
    `${HOLIDAY_ROUTES_BASE_URL}/${OPTIONS}?year=${year}`,
};

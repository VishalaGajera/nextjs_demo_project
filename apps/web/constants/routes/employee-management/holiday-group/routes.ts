import { LIST } from "../../../routes";
import { EMPLOYEE_MANAGEMENT_ROUTES_BASE_URL } from "../routes";

export const HOLIDAY_GROUP_ROUTES_BASE_URL = `${EMPLOYEE_MANAGEMENT_ROUTES_BASE_URL}/holiday-group`;

export const HOLIDAY_GROUP_ROUTES = {
  addHolidayYear: (holidayGroupId: string) =>
    `${HOLIDAY_GROUP_ROUTES_BASE_URL}/${holidayGroupId}/year`,

  getHoliday: (holidayGroupId: string, holidayId: string) =>
    `${HOLIDAY_GROUP_ROUTES_BASE_URL}/${holidayGroupId}/holiday/${holidayId}`,

  holidayGrouAdd: HOLIDAY_GROUP_ROUTES_BASE_URL,

  get: (holidayGroupId: string) =>
    `${HOLIDAY_GROUP_ROUTES_BASE_URL}/${holidayGroupId}`,

  update: (holidayGroupId: string) =>
    `${HOLIDAY_GROUP_ROUTES_BASE_URL}/${holidayGroupId}`,

  holidayGroupDelete: (holidayGroupId: string) =>
    `${HOLIDAY_GROUP_ROUTES_BASE_URL}/${holidayGroupId}`,

  listing: (companyId: string) =>
    // eslint-disable-next-line sonarjs/no-nested-template-literals
    `${HOLIDAY_GROUP_ROUTES_BASE_URL}/${LIST}${companyId ? `?companyId=${companyId}` : ""}`,

  getHolidayById: (holidayGroupId: string) =>
    `${HOLIDAY_GROUP_ROUTES_BASE_URL}/${holidayGroupId}/holiday/${LIST}`,

  post: (holidayGroupId: string) =>
    `${HOLIDAY_GROUP_ROUTES_BASE_URL}/${holidayGroupId}/holiday`,

  delete: (holidayGroupId: string, holidayId: string) =>
    `${HOLIDAY_GROUP_ROUTES_BASE_URL}/${holidayGroupId}/holiday/${holidayId}`,

  patch: (holidayGroupId: string, holidayId: string) =>
    `${HOLIDAY_GROUP_ROUTES_BASE_URL}/${holidayGroupId}/holiday/${holidayId}`,

  options: (companyId: string) =>
    `${HOLIDAY_GROUP_ROUTES_BASE_URL}/options/${companyId}`,

  getHolidayByYear: (holidayGroupId: string) =>
    `${HOLIDAY_GROUP_ROUTES_BASE_URL}/${holidayGroupId}/year`,
};

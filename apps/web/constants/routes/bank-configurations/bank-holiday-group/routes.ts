import { LIST } from "../../../routes";
import { BANK_CONFIGURATIONS_BASE_URL } from "../routes";

export const BANK_HOLIDAY_GROUP_BASE_URL = `${BANK_CONFIGURATIONS_BASE_URL}/bank-holiday-group`;

export const BANK_HOLIDAY_GROUP_ROUTES = {
  listing: `${BANK_HOLIDAY_GROUP_BASE_URL}/${LIST}`,

  getHolidayByYear: (companyId: string) =>
    `${BANK_HOLIDAY_GROUP_BASE_URL}/${companyId}/year`,

  getHolidayById: (companyId: string, year: string) =>
    `${BANK_HOLIDAY_GROUP_BASE_URL}/${companyId}/holiday/${LIST}?year=${year}`,

  post: (companyId: string) =>
    `${BANK_HOLIDAY_GROUP_BASE_URL}/${companyId}/holiday`,

  get: (companyId: string, bankHolidayId: string) =>
    `${BANK_HOLIDAY_GROUP_BASE_URL}/${companyId}/holiday/${bankHolidayId}`,

  patch: (companyId: string, bankHolidayId: string) =>
    `${BANK_HOLIDAY_GROUP_BASE_URL}/${companyId}/holiday/${bankHolidayId}`,

  delete: (companyId: string, bankHolidayId: string) =>
    `${BANK_HOLIDAY_GROUP_BASE_URL}/${companyId}/holiday/${bankHolidayId}`,

  addBankHolidayYear: (companyId: string) =>
    `${BANK_HOLIDAY_GROUP_BASE_URL}/${companyId}/year`,

  getHolidayByYearMonth: (companyId: string, yearMonth: string) =>
    `${BANK_HOLIDAY_GROUP_BASE_URL}/company/${companyId}?yearMonth=${yearMonth}`,
};

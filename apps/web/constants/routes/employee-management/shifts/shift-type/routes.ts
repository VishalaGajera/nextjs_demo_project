import { LIST, OPTIONS } from "../../../../routes";
import { EMPLOYEE_MANAGEMENT_ROUTES_BASE_URL } from "../../routes";

export const SHIFT_TYPE_ROUTES_BASE_URL = `${EMPLOYEE_MANAGEMENT_ROUTES_BASE_URL}/shifts/shift-type`;

export const SHIFT_TYPE_ROUTES = {
  post: SHIFT_TYPE_ROUTES_BASE_URL,

  delete: (shiftId: string) => `${SHIFT_TYPE_ROUTES_BASE_URL}/${shiftId}`,

  listing: `${SHIFT_TYPE_ROUTES_BASE_URL}/${LIST}`,

  patch: (shiftId: string) => `${SHIFT_TYPE_ROUTES_BASE_URL}/${shiftId}`,

  get: (shiftId: string) => `${SHIFT_TYPE_ROUTES_BASE_URL}/${shiftId}`,

  options: (companyId: string) =>
    `${SHIFT_TYPE_ROUTES_BASE_URL}/${OPTIONS}/${companyId}`,
};

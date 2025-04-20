import { EMPLOYEE_ROUTES_BASE_URL } from "../routes";

export const EMPLOYEE_REFERENCE_DETAIL_ROUTES_BASE_URL = "reference-detail";

export const EMPLOYEE_REFERENCE_DETAIL_ROUTES = {
  get: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_REFERENCE_DETAIL_ROUTES_BASE_URL}`,

  patch: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_REFERENCE_DETAIL_ROUTES_BASE_URL}`,
};

import { EMPLOYEE_ROUTES_BASE_URL } from "../routes";

export const EMPLOYEE_BASIC_DETAILS_ROUTES_BASE_URL = `${EMPLOYEE_ROUTES_BASE_URL}/basic-details`;

export const EMPLOYEE_BASIC_DETAILS_ROUTES = {
  get: (employeeId: string) =>
    `${EMPLOYEE_BASIC_DETAILS_ROUTES_BASE_URL}/${employeeId}`,

  patch: (employeeId: string) =>
    `${EMPLOYEE_BASIC_DETAILS_ROUTES_BASE_URL}/${employeeId}`,
};

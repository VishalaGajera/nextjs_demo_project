import { EMPLOYEE_ROUTES_BASE_URL } from "../routes";

export const EMPLOYEE_PERSONAL_INFORMATION_ROUTES_BASE_URL =
  "personal-information";

export const EMPLOYEE_PERSONAL_INFORMATION_ROUTES = {
  get: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_PERSONAL_INFORMATION_ROUTES_BASE_URL}`,

  patch: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_PERSONAL_INFORMATION_ROUTES_BASE_URL}`,
};

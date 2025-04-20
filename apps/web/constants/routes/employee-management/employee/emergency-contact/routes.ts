import { EMPLOYEE_ROUTES_BASE_URL } from "../routes";

export const EMPLOYEE_EMERGENCY_CONTACT_ROUTES_BASE_URL = "emergency-contact";

export const EMPLOYEE_EMERGENCY_CONTACT_ROUTES = {
  get: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_EMERGENCY_CONTACT_ROUTES_BASE_URL}`,

  patch: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_EMERGENCY_CONTACT_ROUTES_BASE_URL}`,
};

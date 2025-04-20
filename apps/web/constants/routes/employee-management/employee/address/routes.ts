import { EMPLOYEE_ROUTES_BASE_URL } from "../routes";

export const EMPLOYEE_ADDRESS_ROUTES_BASE_URL = "address";

export const EMPLOYEE_ADDRESS_ROUTES = {
  get: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_ADDRESS_ROUTES_BASE_URL}`,

  patch: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_ADDRESS_ROUTES_BASE_URL}`,

  getEmployeePermanentAddress: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_ADDRESS_ROUTES_BASE_URL}?addressType=permanent`,

  getEmployeePresentAddress: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_ADDRESS_ROUTES_BASE_URL}?addressType=present`,
};

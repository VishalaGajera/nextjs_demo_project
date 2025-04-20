import { HISTORY } from "../../../../../routes";
import { EMPLOYEE_ROUTES_BASE_URL } from "../../routes";
import { EMPLOYEE_FINANCE_ROUTES_BASE_URL } from "../route";

export const EMPLOYEE_PAYMENT_DETAILS_ROUTES_BASE_URL = "payment-details";

export const EMPLOYEE_PAYMENT_DETAILS_ROUTES = {
  get: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_FINANCE_ROUTES_BASE_URL}/${EMPLOYEE_PAYMENT_DETAILS_ROUTES_BASE_URL}`,

  postHistory: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_FINANCE_ROUTES_BASE_URL}/${EMPLOYEE_PAYMENT_DETAILS_ROUTES_BASE_URL}/${HISTORY}`,

  patch: (bankId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${bankId}/${EMPLOYEE_FINANCE_ROUTES_BASE_URL}/${EMPLOYEE_PAYMENT_DETAILS_ROUTES_BASE_URL}`,
};

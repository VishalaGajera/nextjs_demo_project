import { LIST } from "../../../../routes";
import { EMPLOYEE_ROUTES_BASE_URL } from "../routes";

export const EMPLOYEE_INSURANCE_DETAILS_ROUTES_BASE_URL = "insurance-details";

export const EMPLOYEE_INSURANCE_DETAILS_ROUTES = {
  listing: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_INSURANCE_DETAILS_ROUTES_BASE_URL}/${LIST}`,

  post: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_INSURANCE_DETAILS_ROUTES_BASE_URL}`,

  delete: (employeeId: string, insuranceDetailId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_INSURANCE_DETAILS_ROUTES_BASE_URL}/${insuranceDetailId}`,

  get: (employeeId: string, insuranceDetailId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_INSURANCE_DETAILS_ROUTES_BASE_URL}/${insuranceDetailId}`,

  patch: (employeeId: string, insuranceDetailId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_INSURANCE_DETAILS_ROUTES_BASE_URL}/${insuranceDetailId}`,
};

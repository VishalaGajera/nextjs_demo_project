import { LIST } from "../../../../routes";
import { EMPLOYEE_ROUTES_BASE_URL } from "../routes";

export const EMPLOYEE_EDUCATION_DETAILS_ROUTES_BASE_URL = "education-detail";

export const EMPLOYEE_EDUCATION_DETAILS_ROUTES = {
  patch: (employeeId: string, educationDetailId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_EDUCATION_DETAILS_ROUTES_BASE_URL}/${educationDetailId}`,

  post: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_EDUCATION_DETAILS_ROUTES_BASE_URL}`,

  delete: (employeeId: string, educationDetailId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_EDUCATION_DETAILS_ROUTES_BASE_URL}/${educationDetailId}`,

  listing: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_EDUCATION_DETAILS_ROUTES_BASE_URL}/${LIST}`,

  get: (employeeId: string, educationDetailId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_EDUCATION_DETAILS_ROUTES_BASE_URL}/${educationDetailId}`,
};

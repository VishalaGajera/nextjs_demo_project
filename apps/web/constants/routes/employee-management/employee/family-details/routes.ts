import { LIST } from "../../../../routes";
import { EMPLOYEE_ROUTES_BASE_URL } from "../routes";

export const EMPLOYEE_FAMILY_DETAILS_ROUTES_BASE_URL = "family-details";

export const EMPLOYEE_FAMILY_DETAILS_ROUTES = {
  listing: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_FAMILY_DETAILS_ROUTES_BASE_URL}/${LIST}`,

  post: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_FAMILY_DETAILS_ROUTES_BASE_URL}`,

  delete: (employeeId: string, familyId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_FAMILY_DETAILS_ROUTES_BASE_URL}/${familyId}`,

  get: (employeeId: string, familyId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_FAMILY_DETAILS_ROUTES_BASE_URL}/${familyId}`,

  patch: (employeeId: string, familyDetailsId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_FAMILY_DETAILS_ROUTES_BASE_URL}/${familyDetailsId}`,
};

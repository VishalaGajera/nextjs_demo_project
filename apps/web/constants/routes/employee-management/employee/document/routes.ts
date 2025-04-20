import { LIST, OPTIONS } from "../../../../routes";
import { EMPLOYEE_ROUTES_BASE_URL } from "../routes";

export const EMPLOYEE_DOCUMENT_ROUTES_BASE_URL = "document";

export const EMPLOYEE_DOCUMENT_ROUTES = {
  get: (employeeId: string, documentId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_DOCUMENT_ROUTES_BASE_URL}/${documentId}`,

  patch: (employeeId: string, documentId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_DOCUMENT_ROUTES_BASE_URL}/${documentId}`,

  listing: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_DOCUMENT_ROUTES_BASE_URL}/${LIST}`,

  delete: (employeeId: string, documentId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_DOCUMENT_ROUTES_BASE_URL}/${documentId}`,

  post: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_DOCUMENT_ROUTES_BASE_URL}`,

  options: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_DOCUMENT_ROUTES_BASE_URL}/${OPTIONS}`,

  verify: (employeeId: string, documentId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_DOCUMENT_ROUTES_BASE_URL}/${documentId}/verify`,
};

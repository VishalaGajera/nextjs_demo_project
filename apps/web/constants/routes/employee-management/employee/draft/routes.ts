import { EMPLOYEE_ROUTES_BASE_URL } from "../routes";

export const EMPLOYEE_DRAFT_ROUTES_BASE_URL = `${EMPLOYEE_ROUTES_BASE_URL}/draft`;

export const EMPLOYEE_DRAFT_ROUTES = {
  post: EMPLOYEE_DRAFT_ROUTES_BASE_URL,

  get: (employeeId: string) =>
    `${EMPLOYEE_DRAFT_ROUTES_BASE_URL}/${employeeId}`,

  patch: (employeeId: string) =>
    `${EMPLOYEE_DRAFT_ROUTES_BASE_URL}/${employeeId}`,

  deleteDraft: (employeeId: string) =>
    `${EMPLOYEE_DRAFT_ROUTES_BASE_URL}/${employeeId}`,
};

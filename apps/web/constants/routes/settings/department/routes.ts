import { LIST, OPTIONS } from "../../../routes";
import { SETTINGS_BASE_URL } from "../routes";

export const DEPARTMENT_ROUTES_BASE_URL = `${SETTINGS_BASE_URL}/department`;

export const DEPARTMENT_ROUTES = {
  post: DEPARTMENT_ROUTES_BASE_URL,

  delete: (departmentId: string) =>
    `${DEPARTMENT_ROUTES_BASE_URL}/${departmentId}`,

  listing: `${DEPARTMENT_ROUTES_BASE_URL}/${LIST}`,

  patch: (departmentId: string) =>
    `${DEPARTMENT_ROUTES_BASE_URL}/${departmentId}`,

  get: (departmentId: string) =>
    `${DEPARTMENT_ROUTES_BASE_URL}/${departmentId}`,

  options: (companyId: string | null | undefined) =>
    `${DEPARTMENT_ROUTES_BASE_URL}/${OPTIONS}/${companyId}`,

  multipleOptions: `${DEPARTMENT_ROUTES_BASE_URL}/${OPTIONS}`,

  getDepartmentOptions: (departmentId: string) =>
    `${DEPARTMENT_ROUTES_BASE_URL}/${departmentId}/employee/${OPTIONS}`,
};

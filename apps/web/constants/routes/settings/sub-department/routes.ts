import { LIST, OPTIONS } from "../../../routes";
import { SETTINGS_BASE_URL } from "../routes";

export const SUB_DEPARTMENT_ROUTES_BASE_URL = `${SETTINGS_BASE_URL}/sub-department`;

export const SUB_DEPARTMENT_ROUTES = {
  post: SUB_DEPARTMENT_ROUTES_BASE_URL,

  delete: (subDepartmentId: string) =>
    `${SUB_DEPARTMENT_ROUTES_BASE_URL}/${subDepartmentId}`,

  listing: `${SUB_DEPARTMENT_ROUTES_BASE_URL}/${LIST}`,

  patch: (subDepartmentId: string) =>
    `${SUB_DEPARTMENT_ROUTES_BASE_URL}/${subDepartmentId}`,

  get: (subDepartmentId: string) =>
    `${SUB_DEPARTMENT_ROUTES_BASE_URL}/${subDepartmentId}`,

  options: (departmentId: string | null | undefined) =>
    `${SUB_DEPARTMENT_ROUTES_BASE_URL}/${OPTIONS}/${departmentId}`,

  multipleOptions: `${SUB_DEPARTMENT_ROUTES_BASE_URL}/${OPTIONS}`,
};

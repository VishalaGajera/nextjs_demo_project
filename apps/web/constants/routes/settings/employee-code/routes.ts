import { LIST, OPTIONS } from "../../../routes";
import { SETTINGS_BASE_URL } from "../routes";

export const EMPLOYEE_CODE_ROUTES_BASE_URL = `${SETTINGS_BASE_URL}/employee-code`;

export const EMPLOYEE_CODE_ROUTES = {
  post: EMPLOYEE_CODE_ROUTES_BASE_URL,

  delete: (employeeCodeId: string) =>
    `${EMPLOYEE_CODE_ROUTES_BASE_URL}/${employeeCodeId}`,

  listing: `${EMPLOYEE_CODE_ROUTES_BASE_URL}/${LIST}`,

  patch: (employeeCodeId: string) =>
    `${EMPLOYEE_CODE_ROUTES_BASE_URL}/${employeeCodeId}`,

  get: (employeeCodeId: string) =>
    `${EMPLOYEE_CODE_ROUTES_BASE_URL}/${employeeCodeId}`,

  options: (companyId: string | null | undefined) =>
    `${EMPLOYEE_CODE_ROUTES_BASE_URL}/${OPTIONS}/${companyId}`,

  generateNextCode: (employeeCodeId: string) =>
    `${EMPLOYEE_CODE_ROUTES_BASE_URL}/generate-next-code/${employeeCodeId}`,
};

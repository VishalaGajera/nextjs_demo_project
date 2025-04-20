import { LIST, OPTIONS } from "../../../routes";
import { SETTINGS_BASE_URL } from "../routes";

export const DESIGNATION_ROUTES_BASE_URL = `${SETTINGS_BASE_URL}/designation`;

export const DESIGNATION_ROUTES = {
  post: DESIGNATION_ROUTES_BASE_URL,

  delete: (departmentId: string) =>
    `${DESIGNATION_ROUTES_BASE_URL}/${departmentId}`,

  listing: `${DESIGNATION_ROUTES_BASE_URL}/${LIST}`,

  patch: (departmentId: string) =>
    `${DESIGNATION_ROUTES_BASE_URL}/${departmentId}`,

  get: (departmentId: string) =>
    `${DESIGNATION_ROUTES_BASE_URL}/${departmentId}`,

  options: (companyId: string | null | undefined) =>
    `${DESIGNATION_ROUTES_BASE_URL}/${OPTIONS}/${companyId}`,
};

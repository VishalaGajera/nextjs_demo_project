import { LIST, OPTIONS } from "../../../routes";
import { SETTINGS_BASE_URL } from "../routes";

export const WORK_TYPE_ROUTES_BASE_URL = `${SETTINGS_BASE_URL}/work-type`;

export const WORK_TYPE_ROUTES = {
  post: WORK_TYPE_ROUTES_BASE_URL,

  delete: (workTypeId: string) => `${WORK_TYPE_ROUTES_BASE_URL}/${workTypeId}`,

  listing: `${WORK_TYPE_ROUTES_BASE_URL}/${LIST}`,

  patch: (workTypeId: string) => `${WORK_TYPE_ROUTES_BASE_URL}/${workTypeId}`,

  get: (workTypeId: string) => `${WORK_TYPE_ROUTES_BASE_URL}/${workTypeId}`,

  options: (companyId: string) =>
    `${WORK_TYPE_ROUTES_BASE_URL}/${OPTIONS}/${companyId}`,
};

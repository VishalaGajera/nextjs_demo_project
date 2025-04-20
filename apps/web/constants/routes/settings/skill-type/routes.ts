import { LIST, OPTIONS } from "../../../routes";
import { SETTINGS_BASE_URL } from "../routes";

export const SKILL_TYPE_ROUTES_BASE_URL = `${SETTINGS_BASE_URL}/skill-type`;

export const SKILL_TYPE_ROUTES = {
  post: SKILL_TYPE_ROUTES_BASE_URL,

  delete: (skillTypeId: string) =>
    `${SKILL_TYPE_ROUTES_BASE_URL}/${skillTypeId}`,

  listing: `${SKILL_TYPE_ROUTES_BASE_URL}/${LIST}`,

  patch: (skillTypeId: string) =>
    `${SKILL_TYPE_ROUTES_BASE_URL}/${skillTypeId}`,

  get: (skillTypeId: string) => `${SKILL_TYPE_ROUTES_BASE_URL}/${skillTypeId}`,

  options: (companyId: string) =>
    `${SKILL_TYPE_ROUTES_BASE_URL}/${OPTIONS}/${companyId}`,
};

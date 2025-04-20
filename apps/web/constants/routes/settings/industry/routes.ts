import { LIST, OPTIONS } from "../../../routes";
import { SETTINGS_BASE_URL } from "../routes";

export const INDUSTRY_ROUTES_BASE_URL = `${SETTINGS_BASE_URL}/industry`;

export const INDUSTRY_ROUTES = {
  post: INDUSTRY_ROUTES_BASE_URL,

  delete: (industryId: string) => `${INDUSTRY_ROUTES_BASE_URL}/${industryId}`,

  listing: `${INDUSTRY_ROUTES_BASE_URL}/${LIST}`,

  patch: (industryId: string) => `${INDUSTRY_ROUTES_BASE_URL}/${industryId}`,

  get: (industryId: string) => `${INDUSTRY_ROUTES_BASE_URL}/${industryId}`,

  options: `${INDUSTRY_ROUTES_BASE_URL}/${OPTIONS}`,
};

import { LIST, OPTIONS } from "../../../../../routes";
import { CONTRIBUTIONS_ROUTES_BASE_URL } from "../routes";

export const ESIC_ROUTES_BASE_URL = `${CONTRIBUTIONS_ROUTES_BASE_URL}/esic-group`;

export const ESIC_ROUTES = {
  listing: `${ESIC_ROUTES_BASE_URL}/${LIST}?tab=esic`,

  post: ESIC_ROUTES_BASE_URL,

  patch: (esicId: string) => `${ESIC_ROUTES_BASE_URL}/${esicId}`,

  get: (esicId: string) => `${ESIC_ROUTES_BASE_URL}/${esicId}`,

  delete: (esicId: string) => `${ESIC_ROUTES_BASE_URL}/${esicId}`,

  options: `${ESIC_ROUTES_BASE_URL}/${OPTIONS}`,
};

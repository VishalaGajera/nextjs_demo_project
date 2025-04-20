import { LIST } from "../../../../../routes";
import { CONTRIBUTIONS_ROUTES_BASE_URL } from "../routes";

export const GRATUITY_GROUP_BASE_URL = `${CONTRIBUTIONS_ROUTES_BASE_URL}/gratuity-group`;

export const GRATUITY_GROUP_ROUTES = {
  post: () => `${GRATUITY_GROUP_BASE_URL}/${LIST}`,
  add: () => `${GRATUITY_GROUP_BASE_URL}`,
  patch: (gratuityId: string) => `${GRATUITY_GROUP_BASE_URL}/${gratuityId}`,
  get: (gratuityId: string) => `${GRATUITY_GROUP_BASE_URL}/${gratuityId}`,
  delete: (gratuityId: string) => `${GRATUITY_GROUP_BASE_URL}/${gratuityId}`,
};

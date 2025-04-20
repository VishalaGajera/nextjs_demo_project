import { LIST } from "../../../../../routes";
import { CONTRIBUTIONS_ROUTES_BASE_URL } from "../routes";

export const LWF_GROUP_ROUTES_BASE_URL = `${CONTRIBUTIONS_ROUTES_BASE_URL}/lwf-group`;

export const LWF_GROUP_ROUTES = {
  get: (lwfGroupId: string) => `${LWF_GROUP_ROUTES_BASE_URL}/${lwfGroupId}`,
  delete: (lwfGroupId: string) => `${LWF_GROUP_ROUTES_BASE_URL}/${lwfGroupId}`,
  patch: (lwfGroupId: string) => `${LWF_GROUP_ROUTES_BASE_URL}/${lwfGroupId}`,
  listing: `${LWF_GROUP_ROUTES_BASE_URL}/${LIST}`,
};

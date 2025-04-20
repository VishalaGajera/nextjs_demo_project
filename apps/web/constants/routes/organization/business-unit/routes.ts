import { LIST, OPTIONS } from "../../../routes";
import { ORGANIZATION_BASE_URL } from "../routes";

export const BUSINESS_UNIT_ROUTES_BASE_URL = `${ORGANIZATION_BASE_URL}/business-unit`;

export const BUSINESS_UNIT_ROUTES = {
  post: BUSINESS_UNIT_ROUTES_BASE_URL,

  delete: (businessUnitId: string) =>
    `${BUSINESS_UNIT_ROUTES_BASE_URL}/${businessUnitId}`,

  listing: `${BUSINESS_UNIT_ROUTES_BASE_URL}/${LIST}`,

  patch: (businessUnitId: string) =>
    `${BUSINESS_UNIT_ROUTES_BASE_URL}/${businessUnitId}`,

  get: (businessUnitId: string) =>
    `${BUSINESS_UNIT_ROUTES_BASE_URL}/${businessUnitId}`,

  options: (companyId?: string | null) =>
    `${BUSINESS_UNIT_ROUTES_BASE_URL}/${OPTIONS}${
      companyId ? `?companyId=${companyId}` : ""
    }`,

  multipleOptions: `${BUSINESS_UNIT_ROUTES_BASE_URL}/${OPTIONS}`,

  getBusinessUnitEmployeeOptions: (businessUnitId: string) =>
    `${BUSINESS_UNIT_ROUTES_BASE_URL}/${businessUnitId}/employee/${OPTIONS}`,
};

import { LIST, OPTIONS } from "../../../routes";
import { ORGANIZATION_BASE_URL } from "../routes";

export const BUSINESS_UNIT_LOCATION_ROUTES_BASE_URL = `${ORGANIZATION_BASE_URL}/business-unit-location`;

export const BUSINESS_UNIT_LOCATION_ROUTES = {
  post: BUSINESS_UNIT_LOCATION_ROUTES_BASE_URL,

  delete: (locationId: string) =>
    `${BUSINESS_UNIT_LOCATION_ROUTES_BASE_URL}/${locationId}`,

  listing: `${BUSINESS_UNIT_LOCATION_ROUTES_BASE_URL}/${LIST}`,

  patch: (locationId: string) =>
    `${BUSINESS_UNIT_LOCATION_ROUTES_BASE_URL}/${locationId}`,

  get: (locationId: string) =>
    `${BUSINESS_UNIT_LOCATION_ROUTES_BASE_URL}/${locationId}`,

  options: (businessUnitId: string | null | undefined) =>
    `${BUSINESS_UNIT_LOCATION_ROUTES_BASE_URL}/${OPTIONS}/${businessUnitId}`,

  multipleOptions: `${BUSINESS_UNIT_LOCATION_ROUTES_BASE_URL}/${OPTIONS}`,
};

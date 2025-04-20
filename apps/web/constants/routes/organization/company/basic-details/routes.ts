import { COMPANY_ROUTES_BASE_URL } from "../routes";

const BASIC_DETAILS_BASE_URL = "basic-details";

export const BASIC_DETAILS_ROUTES = {
  patch: (companyId: string) =>
    `${COMPANY_ROUTES_BASE_URL}/${companyId}/${BASIC_DETAILS_BASE_URL}`,

  get: (companyId: string) =>
    `${COMPANY_ROUTES_BASE_URL}/${companyId}/${BASIC_DETAILS_BASE_URL}`,
};

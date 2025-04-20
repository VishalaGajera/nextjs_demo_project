import { COMPANY_ROUTES_BASE_URL } from "../routes";

export const STATUTORY_DETAILS = "statutory-details";

export const STATUTORY_DETAILS_ROUTES = {
  patch: (companyId: string) =>
    `${COMPANY_ROUTES_BASE_URL}/${companyId}/${STATUTORY_DETAILS}`,

  getAll: (companyId: string) =>
    `${COMPANY_ROUTES_BASE_URL}/${companyId}/${STATUTORY_DETAILS}`,
};

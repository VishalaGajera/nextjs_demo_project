import { COMPANY_ROUTES_BASE_URL } from "../routes";

export const AUTHORISED_PERSON_DETAILS_BASE_URL = "authorised-person-details";

export const AUTHORISED_PERSON_DETAILS_ROUTES = {
  getAll: (companyId: string) =>
    `${COMPANY_ROUTES_BASE_URL}/${companyId}/${AUTHORISED_PERSON_DETAILS_BASE_URL}`,

  post: (companyId: string) =>
    `${COMPANY_ROUTES_BASE_URL}/${companyId}/${AUTHORISED_PERSON_DETAILS_BASE_URL}`,

  delete: (companyId: string, personId: string) =>
    `${COMPANY_ROUTES_BASE_URL}/${companyId}/${AUTHORISED_PERSON_DETAILS_BASE_URL}/${personId}`,

  patch: (companyId: string, personId: string) =>
    `${COMPANY_ROUTES_BASE_URL}/${companyId}/${AUTHORISED_PERSON_DETAILS_BASE_URL}/${personId}`,

  get: (companyId: string, personId: string) =>
    `${COMPANY_ROUTES_BASE_URL}/${companyId}/${AUTHORISED_PERSON_DETAILS_BASE_URL}?authorised_person_id=${personId}`,
};

import { COMPANY_ROUTES_BASE_URL } from "../routes";

export const DIRECTOR_DETAILS = "director-details";

export const DIRECTOR_DETAILS_ROUTES = {
  post: (companyId: string) =>
    `${COMPANY_ROUTES_BASE_URL}/${companyId}/${DIRECTOR_DETAILS}`,

  delete: (companyId: string, directorDetailId: string) =>
    `${COMPANY_ROUTES_BASE_URL}/${companyId}/${DIRECTOR_DETAILS}/${directorDetailId}`,

  patch: (companyId: string, directorDetailId: string | null) =>
    `${COMPANY_ROUTES_BASE_URL}/${companyId}/${DIRECTOR_DETAILS}/${directorDetailId}`,

  get: (companyId: string, directorDetailId: string) =>
    `${COMPANY_ROUTES_BASE_URL}/${companyId}/${DIRECTOR_DETAILS}?director_id=${directorDetailId}`,

  getAll: (companyId: string) =>
    `${COMPANY_ROUTES_BASE_URL}/${companyId}/${DIRECTOR_DETAILS}`,
};

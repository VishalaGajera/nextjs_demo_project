import { LIST, OPTIONS } from "../../../routes";
import { SETTINGS_BASE_URL } from "../routes";

export const GRADE_ROUTES_BASE_URL = `${SETTINGS_BASE_URL}/grade`;

export const GRADE_ROUTES = {
  post: GRADE_ROUTES_BASE_URL,

  delete: (gradeId: string) => `${GRADE_ROUTES_BASE_URL}/${gradeId}`,

  listing: `${GRADE_ROUTES_BASE_URL}/${LIST}`,

  patch: (gradeId: string) => `${GRADE_ROUTES_BASE_URL}/${gradeId}`,

  get: (gradeId: string) => `${GRADE_ROUTES_BASE_URL}/${gradeId}`,

  options: (companyId: string) =>
    `${GRADE_ROUTES_BASE_URL}/${OPTIONS}/${companyId}`,
};

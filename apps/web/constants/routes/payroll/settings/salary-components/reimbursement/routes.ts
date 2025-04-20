import { LIST } from "../../../../../routes";
import { SALARY_COMPONENTS_BASE_URL } from "../routes";

export const REIMBURSEMENT_ROUTES_BASE_URL = `${SALARY_COMPONENTS_BASE_URL}/reimbursement`;

export const REIMBURSEMENT_ROUTES = {
  post: REIMBURSEMENT_ROUTES_BASE_URL,

  delete: (reimbursementId: string) =>
    `${REIMBURSEMENT_ROUTES_BASE_URL}/${reimbursementId}`,

  listing: `${REIMBURSEMENT_ROUTES_BASE_URL}/${LIST}?tab=reimbursement`,

  patch: (reimbursementId: string) =>
    `${REIMBURSEMENT_ROUTES_BASE_URL}/${reimbursementId}`,

  get: (reimbursementId: string) =>
    `${REIMBURSEMENT_ROUTES_BASE_URL}/${reimbursementId}`,
};

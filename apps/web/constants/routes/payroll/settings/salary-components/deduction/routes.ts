import { LIST } from "../../../../../routes";
import { SALARY_COMPONENTS_BASE_URL } from "../routes";

export const DEDUCTION_ROUTES_BASE_URL = `${SALARY_COMPONENTS_BASE_URL}/deduction`;

export const DEDUCTION_ROUTES = {
  post: DEDUCTION_ROUTES_BASE_URL,

  delete: (deductionId: string) =>
    `${DEDUCTION_ROUTES_BASE_URL}/${deductionId}`,

  listing: `${DEDUCTION_ROUTES_BASE_URL}/${LIST}?tab=deduction`,

  patch: (deductionId: string) => `${DEDUCTION_ROUTES_BASE_URL}/${deductionId}`,

  get: (deductionId: string) => `${DEDUCTION_ROUTES_BASE_URL}/${deductionId}`,
};

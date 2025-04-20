import { LIST } from "../../../../../routes";
import { SALARY_COMPONENTS_BASE_URL } from "../routes";

export const EARNING_BASE_URL = `${SALARY_COMPONENTS_BASE_URL}/earning`;

export const EARNING_DETAILS_ROUTES = {
  post: EARNING_BASE_URL,

  listing: `${EARNING_BASE_URL}/${LIST}`,

  patch: (earningId: string) => `${EARNING_BASE_URL}/${earningId}`,

  get: (earningId: string) => `${EARNING_BASE_URL}/${earningId}`,

  delete: (earningId: string) => `${EARNING_BASE_URL}/${earningId}`,
};

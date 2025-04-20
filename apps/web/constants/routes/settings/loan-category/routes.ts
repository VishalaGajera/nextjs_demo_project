import { LIST, OPTIONS } from "../../../routes";
import { SETTINGS_BASE_URL } from "../routes";

export const LOAN_CATEGORY_ROUTES_BASE_URL = `${SETTINGS_BASE_URL}/loan-category`;

export const LOAN_CATEGORY_ROUTES = {
  post: `${LOAN_CATEGORY_ROUTES_BASE_URL}`,

  delete: (loanCategoryId: string) =>
    `${LOAN_CATEGORY_ROUTES_BASE_URL}/${loanCategoryId}`,

  listing: `${LOAN_CATEGORY_ROUTES_BASE_URL}/${LIST}`,

  patch: (loanCategoryId: string) =>
    `${LOAN_CATEGORY_ROUTES_BASE_URL}/${loanCategoryId}`,

  get: (loanCategoryId: string) =>
    `${LOAN_CATEGORY_ROUTES_BASE_URL}/${loanCategoryId}`,

  options: `${LOAN_CATEGORY_ROUTES_BASE_URL}/${OPTIONS}`,
};

import { LIST, OPTIONS } from "../../../routes";
import { SETTINGS_BASE_URL } from "../routes";

export const BANK_ROUTES_BASE_URL = `${SETTINGS_BASE_URL}/bank`;

export const BANK_ROUTES = {
  post: BANK_ROUTES_BASE_URL,

  delete: (bankId: string) => `${BANK_ROUTES_BASE_URL}/${bankId}`,

  listing: `${BANK_ROUTES_BASE_URL}/${LIST}`,

  patch: (bankId: string) => `${BANK_ROUTES_BASE_URL}/${bankId}`,

  get: (bankId: string) => `${BANK_ROUTES_BASE_URL}/${bankId}`,

  options: `${BANK_ROUTES_BASE_URL}/${OPTIONS}`,
};

import { LIST } from "../../../routes";
import { ORGANIZATION_BASE_URL } from "../routes";

export const BANK_ROUTES_BASE_URL = `${ORGANIZATION_BASE_URL}/bank`;

export const BANK_ROUTES = {
  post: BANK_ROUTES_BASE_URL,

  delete: (companyBankId: string) => `${BANK_ROUTES_BASE_URL}/${companyBankId}`,

  listing: `${BANK_ROUTES_BASE_URL}/${LIST}`,

  patch: (companyBankId: string) => `${BANK_ROUTES_BASE_URL}/${companyBankId}`,

  get: (companyBankId: string) => `${BANK_ROUTES_BASE_URL}/${companyBankId}`,
};

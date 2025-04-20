import { LIST } from "../../../../../../routes";
import { INVESTMENT_DEDUCTIONS_ROUTES_BASE_URL } from "../routes";

export const INVESTMENT_SCHEMES_ROUTES_BASE_URL = `${INVESTMENT_DEDUCTIONS_ROUTES_BASE_URL}/investment-scheme`;

export const INVESTMENT_SCHEMES_ROUTES = {
  listing: `${INVESTMENT_SCHEMES_ROUTES_BASE_URL}/${LIST}`,

  post: INVESTMENT_SCHEMES_ROUTES_BASE_URL,

  patch: (investmentSchemesId: string) =>
    `${INVESTMENT_SCHEMES_ROUTES_BASE_URL}/${investmentSchemesId}`,

  get: (investmentSchemesId: string) =>
    `${INVESTMENT_SCHEMES_ROUTES_BASE_URL}/${investmentSchemesId}`,

  delete: (investmentSchemesId: string) =>
    `${INVESTMENT_SCHEMES_ROUTES_BASE_URL}/${investmentSchemesId}`,
};

import { LIST, OPTIONS } from "../../../../../../routes";
import { INVESTMENT_DEDUCTIONS_ROUTES_BASE_URL } from "../routes";

export const TAX_SECTIONS_ROUTES_BASE_URL = `${INVESTMENT_DEDUCTIONS_ROUTES_BASE_URL}/tax-sections`;

export const TAX_SECTIONS_ROUTES = {
  listing: `${TAX_SECTIONS_ROUTES_BASE_URL}/${LIST}`,

  post: TAX_SECTIONS_ROUTES_BASE_URL,

  patch: (taxSectionsId: string) =>
    `${TAX_SECTIONS_ROUTES_BASE_URL}/${taxSectionsId}`,

  get: (taxSectionsId: string) =>
    `${TAX_SECTIONS_ROUTES_BASE_URL}/${taxSectionsId}`,

  delete: (taxSectionsId: string) =>
    `${TAX_SECTIONS_ROUTES_BASE_URL}/${taxSectionsId}`,

  options: `${TAX_SECTIONS_ROUTES_BASE_URL}/${OPTIONS}`,
};

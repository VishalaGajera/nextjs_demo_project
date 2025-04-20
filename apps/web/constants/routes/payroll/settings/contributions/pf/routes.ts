import { LIST, OPTIONS } from "../../../../../routes";
import { CONTRIBUTIONS_ROUTES_BASE_URL } from "../routes";

export const PROVIDENT_FUND_ROUTES_BASE_URL = `${CONTRIBUTIONS_ROUTES_BASE_URL}/epf-group`;

export const PROVIDENT_FUND_ROUTES = {
  listing: `${PROVIDENT_FUND_ROUTES_BASE_URL}/${LIST}?tab=pf`,

  post: PROVIDENT_FUND_ROUTES_BASE_URL,

  patch: (providentFundId: string) =>
    `${PROVIDENT_FUND_ROUTES_BASE_URL}/${providentFundId}`,

  get: (providentFundId: string) =>
    `${PROVIDENT_FUND_ROUTES_BASE_URL}/${providentFundId}`,

  delete: (providentFundId: string) =>
    `${PROVIDENT_FUND_ROUTES_BASE_URL}/${providentFundId}`,

  options: `${PROVIDENT_FUND_ROUTES_BASE_URL}/${OPTIONS}`,
};

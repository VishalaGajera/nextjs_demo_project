import { getQueryString } from "../../../../utils/helper";
import { LIST, OPTIONS } from "../../../routes";
import { ORGANIZATION_BASE_URL } from "../routes";

export const COMPANY_ROUTES_BASE_URL = `${ORGANIZATION_BASE_URL}/company`;

export type QueryParams = Partial<{
  employee_code_type: boolean;
  only_auto_generated: boolean;
}>;

export const COMPANY_ROUTES = {
  post: COMPANY_ROUTES_BASE_URL,

  delete: (companyId: string) => `${COMPANY_ROUTES_BASE_URL}/${companyId}`,

  listing: `${COMPANY_ROUTES_BASE_URL}/${LIST}`,

  options: (queryParams: QueryParams = {}) => {
    const queryString = queryParams ? `?${getQueryString(queryParams)}` : "";

    return `${COMPANY_ROUTES_BASE_URL}/${OPTIONS}${queryString}`;
  },
};

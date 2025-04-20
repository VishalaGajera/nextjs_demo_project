import { getQueryString } from "../../../../utils/helper";
import { LIST } from "../../../routes";
import { EMPLOYEE_MANAGEMENT_ROUTES_BASE_URL } from "../routes";

export type QueryParams = Partial<{
  address: boolean;
  label: boolean;
  mobile_no: boolean;
  employee_code: boolean;
  punch_code: boolean;
  avatar: boolean;
}>;

export const EMPLOYEE_ROUTES_BASE_URL = `${EMPLOYEE_MANAGEMENT_ROUTES_BASE_URL}/employee`;

export const EMPLOYEE_ROUTES = {
  post: EMPLOYEE_ROUTES_BASE_URL,

  listing: `${EMPLOYEE_ROUTES_BASE_URL}/${LIST}`,

  options: (companyId: string, queryParams: QueryParams) => {
    const queryString = getQueryString(queryParams);

    return `${EMPLOYEE_ROUTES_BASE_URL}/options/${companyId}?${queryString}`;
  },

  optionsWithoutCompany: (queryParams: QueryParams) => {
    const queryString = getQueryString(queryParams);

    return `${EMPLOYEE_ROUTES_BASE_URL}/options?${queryString}`;
  },
};

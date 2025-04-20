import { LIST, OPTIONS } from "../../../../routes";
import { POLICY_CONFIGURATION_BASE_URL } from "../../routes";
import { OVERTIME_BASE_URL } from "../routes";

export const OVERTIME_RATE_TYPE_ROUTES_BASE_URL = `${POLICY_CONFIGURATION_BASE_URL}/${OVERTIME_BASE_URL}/overtime-rate-type`;

export const OVERTIME_RATE_TYPE_ROUTES = {
  post: OVERTIME_RATE_TYPE_ROUTES_BASE_URL,

  delete: (overtimeRateTypeId: string) =>
    `${OVERTIME_RATE_TYPE_ROUTES_BASE_URL}/${overtimeRateTypeId}`,

  get: (overtimeRateTypeId: string) =>
    `${OVERTIME_RATE_TYPE_ROUTES_BASE_URL}/${overtimeRateTypeId}`,

  patch: (overtimeRateTypeId: string) =>
    `${OVERTIME_RATE_TYPE_ROUTES_BASE_URL}/${overtimeRateTypeId}`,

  listing: `${OVERTIME_RATE_TYPE_ROUTES_BASE_URL}/${LIST}`,

  options: (companyId: string) =>
    `${OVERTIME_RATE_TYPE_ROUTES_BASE_URL}/${OPTIONS}/${companyId}`,
};

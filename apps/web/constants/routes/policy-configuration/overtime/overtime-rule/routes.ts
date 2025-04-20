import { LIST, OPTIONS } from "../../../../routes";
import { POLICY_CONFIGURATION_BASE_URL } from "../../routes";
import { OVERTIME_BASE_URL } from "../routes";

export const OVERTIME_RULE_ROUTES_BASE_URL = `${POLICY_CONFIGURATION_BASE_URL}/${OVERTIME_BASE_URL}/overtime-rule`;

export const OVERTIME_RULE_ROUTES = {
  post: OVERTIME_RULE_ROUTES_BASE_URL,

  delete: (overtimeRulesId: string) =>
    `${OVERTIME_RULE_ROUTES_BASE_URL}/${overtimeRulesId}`,

  get: (overtimeRulesId: string) =>
    `${OVERTIME_RULE_ROUTES_BASE_URL}/${overtimeRulesId}`,

  patch: (overtimeRulesId: string) =>
    `${OVERTIME_RULE_ROUTES_BASE_URL}/${overtimeRulesId}`,

  listing: `${OVERTIME_RULE_ROUTES_BASE_URL}/${LIST}`,

  options: (companyId: string) =>
    `${OVERTIME_RULE_ROUTES_BASE_URL}/${OPTIONS}/${companyId}`,
};

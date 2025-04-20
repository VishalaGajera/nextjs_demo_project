import { LIST, OPTIONS } from "../../../../routes";
import { POLICY_CONFIGURATION_BASE_URL } from "../../routes";
import { ATTENDANCE_BASE_URL } from "../routes";

export const PENALTY_RULE_BASE_URL = `${POLICY_CONFIGURATION_BASE_URL}/${ATTENDANCE_BASE_URL}/penalty-rule`;

export const PENALTY_RULE_ROUTES = {
  post: PENALTY_RULE_BASE_URL,

  delete: (penaltyRulesId: string) =>
    `${PENALTY_RULE_BASE_URL}/${penaltyRulesId}`,

  listing: `${PENALTY_RULE_BASE_URL}/${LIST}`,

  patch: (penaltyRulesId: string) =>
    `${PENALTY_RULE_BASE_URL}/${penaltyRulesId}`,

  get: (penaltyRulesId: string) => `${PENALTY_RULE_BASE_URL}/${penaltyRulesId}`,

  options: (companyId: string) =>
    `${PENALTY_RULE_BASE_URL}/${OPTIONS}/${companyId}`,
};

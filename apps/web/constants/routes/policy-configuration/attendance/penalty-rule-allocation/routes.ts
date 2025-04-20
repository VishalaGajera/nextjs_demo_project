import { LIST } from "../../../../routes";
import { POLICY_CONFIGURATION_BASE_URL } from "../../routes";
import { ATTENDANCE_BASE_URL } from "../routes";

export const PENALTY_RULE_ALLOCATION_BASE_URL = `${POLICY_CONFIGURATION_BASE_URL}/${ATTENDANCE_BASE_URL}/penalty-rule-allocation`;

export const PENALTY_RULE_ALLOCATION_ROUTES = {
  listing: (currentDate: string) =>
    `${PENALTY_RULE_ALLOCATION_BASE_URL}/employee/${LIST}?current_date=${currentDate}`,

  patch: (currentDate: string) =>
    `${PENALTY_RULE_ALLOCATION_BASE_URL}/assign-penalty-rule?currentDate=${currentDate}`,
};

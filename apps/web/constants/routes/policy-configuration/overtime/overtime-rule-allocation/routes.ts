import { LIST } from "../../../../routes";
import { POLICY_CONFIGURATION_BASE_URL } from "../../routes";
import { OVERTIME_BASE_URL } from "../routes";

export const OVERTIME_RULE_ALLOCATION_ROUTES_BASE_URL = `${POLICY_CONFIGURATION_BASE_URL}/${OVERTIME_BASE_URL}/overtime-rule-allocation`;

export const OVERTIME_RULE_ALLOCATION_ROUTES = {
  listing: (currentDate: string) =>
    `${OVERTIME_RULE_ALLOCATION_ROUTES_BASE_URL}/employees/${LIST}?current_date=${currentDate}`,

  patch: (currentDate: string) =>
    `${OVERTIME_RULE_ALLOCATION_ROUTES_BASE_URL}/assign-overtime-rule?currentDate=${currentDate}`,
};

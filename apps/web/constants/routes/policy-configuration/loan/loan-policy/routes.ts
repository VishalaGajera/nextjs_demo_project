import { LIST, OPTIONS } from "../../../../routes";
import { POLICY_CONFIGURATION_BASE_URL } from "../../routes";
import { LOAN_BASE_URL } from "../routes";

export const LOAN_POLICY_BASE_URL = `${POLICY_CONFIGURATION_BASE_URL}/${LOAN_BASE_URL}/loan-policy`;

export const LOAN_POLICY_ROUTES = {
  listing: `${LOAN_POLICY_BASE_URL}/${LIST}`,

  post: LOAN_POLICY_BASE_URL,

  get: (policyId: string) => `${LOAN_POLICY_BASE_URL}/${policyId}`,

  patch: (policyId: string) => `${LOAN_POLICY_BASE_URL}/${policyId}`,

  delete: (policyId: string) => `${LOAN_POLICY_BASE_URL}/${policyId}`,

  options: (companyId: string) =>
    `${LOAN_POLICY_BASE_URL}/${OPTIONS}/${companyId}`,
};

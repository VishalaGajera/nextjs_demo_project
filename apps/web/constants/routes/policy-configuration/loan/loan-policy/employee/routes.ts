import { OPTIONS } from "../../../../../routes";
import { LOAN_POLICY_BASE_URL } from "../routes";

export const LOAN_POLICY_EMPLOYEE_BASE_URL = `${LOAN_POLICY_BASE_URL}/employee`;

export const LOAN_POLICY_EMPLOYEE_ROUTES = {
  options: (companyId: string, currentDate: string) =>
    `${LOAN_POLICY_EMPLOYEE_BASE_URL}/${companyId}/${OPTIONS}?current_date=${currentDate}`,
};

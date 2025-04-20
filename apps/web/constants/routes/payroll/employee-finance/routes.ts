import { API, LIST } from "../../../routes";

const EMPLOYEE_FINANCE_BASE_URL = `${API}/payroll/employee-finance`;

export const EMPLOYEE_FINANCE_ROUTES = {
  list: `${EMPLOYEE_FINANCE_BASE_URL}/employee/${LIST}`,

  get: (employeeId: string) =>
    `${EMPLOYEE_FINANCE_BASE_URL}/${employeeId}/salary-setup/timeline`,

  post: (employeeId: string) =>
    `${EMPLOYEE_FINANCE_BASE_URL}/${employeeId}/salary-setup`,
};

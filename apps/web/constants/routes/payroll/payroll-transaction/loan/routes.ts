import { LIST } from "../../../../routes";
import { PAYROLL_TRANSACTIONS_ROUTES_BASE_URL } from "../routes";

export const LOAN_ROUTES_BASE_URL = `${PAYROLL_TRANSACTIONS_ROUTES_BASE_URL}/loan`;

export const LOAN_ROUTES = {
  listing: `${LOAN_ROUTES_BASE_URL}/${LIST}`,

  post: (currentDate: string) =>
    `${LOAN_ROUTES_BASE_URL}?current_date=${currentDate}`,

  get: (loanId: string) => `${LOAN_ROUTES_BASE_URL}/${loanId}`,

  patch: (loanId: string) => `${LOAN_ROUTES_BASE_URL}/${loanId}`,

  delete: (loanId: string) => `${LOAN_ROUTES_BASE_URL}/${loanId}`,

  status: (loanId: string, status: string) =>
    `${LOAN_ROUTES_BASE_URL}/${loanId}/status-change/${status}`,
};

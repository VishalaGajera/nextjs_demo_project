import { LIST } from "../../../../routes";
import { TRANSACTIONS_BASE_URL } from "../../routes";
import { APPROVALS_BASE_URL } from "../routes";

export const APPROVAL_OVERTIME_BASE_URL = `${TRANSACTIONS_BASE_URL}/${APPROVALS_BASE_URL}/overtime-requests`;

export const OVERTIME_ROUTES = {
  listing: () => `${APPROVAL_OVERTIME_BASE_URL}/employee/${LIST}`,
};

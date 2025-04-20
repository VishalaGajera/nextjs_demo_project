import { LIST } from "../../../../routes";
import { TRANSACTIONS_BASE_URL } from "../../routes";
import { APPROVALS_BASE_URL } from "../routes";

export const APPROVAL_LEAVE_BASE_URL = `${TRANSACTIONS_BASE_URL}/${APPROVALS_BASE_URL}/leave-requests`;

export const LEAVE_ROUTES = {
  listing: () => `${APPROVAL_LEAVE_BASE_URL}/employee/${LIST}`,
};

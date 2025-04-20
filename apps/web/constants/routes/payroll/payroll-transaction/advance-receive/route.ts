import { LIST } from "../../../../routes";
import { PAYROLL_TRANSACTION_BASE_URL } from "../route";

const ADVANCE_AND_RECEIVE_ROUTES_BASE_URL = `${PAYROLL_TRANSACTION_BASE_URL}/advance-and-receive`;

export const ADVANCE_AND_RECEIVE_ROUTES = {
  listing: `${ADVANCE_AND_RECEIVE_ROUTES_BASE_URL}/${LIST}`,

  post: ADVANCE_AND_RECEIVE_ROUTES_BASE_URL,

  delete: (advanceAndReceiveId: string) =>
    `${ADVANCE_AND_RECEIVE_ROUTES_BASE_URL}/${advanceAndReceiveId}`,

  get: (advanceAndReceiveId: string) =>
    `${ADVANCE_AND_RECEIVE_ROUTES_BASE_URL}/${advanceAndReceiveId}`,

  patch: (advanceAndReceiveId: string) =>
    `${ADVANCE_AND_RECEIVE_ROUTES_BASE_URL}/${advanceAndReceiveId}`,
};

import { LIST, OPTIONS } from "../../../../routes";
import { LEAVE_ROUTES_BASE_URL } from "../routes";

export const LEAVE_TYPE_ROUTES_BASE_URL = `${LEAVE_ROUTES_BASE_URL}/leave-type`;

export const LEAVE_ROUTES = {
  post: LEAVE_TYPE_ROUTES_BASE_URL,

  delete: (leaveTypeId: string) =>
    `${LEAVE_TYPE_ROUTES_BASE_URL}/${leaveTypeId}`,

  listing: `${LEAVE_TYPE_ROUTES_BASE_URL}/${LIST}`,

  patch: (leaveTypeId: string) =>
    `${LEAVE_TYPE_ROUTES_BASE_URL}/${leaveTypeId}`,

  get: (leaveTypeId: string) => `${LEAVE_TYPE_ROUTES_BASE_URL}/${leaveTypeId}`,

  options: (leaveTypeId: string) =>
    `${LEAVE_TYPE_ROUTES_BASE_URL}/${OPTIONS}/${leaveTypeId} `,

  optionsPerCompany: (companyId: string) =>
    `${LEAVE_TYPE_ROUTES_BASE_URL}/leave-type-names/${companyId} `,
};

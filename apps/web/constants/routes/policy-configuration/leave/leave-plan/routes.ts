import { LIST, OPTIONS } from "../../../../routes";
import { LEAVE_ROUTES_BASE_URL } from "../routes";

export const LEAVE_PLAN_ROUTES_BASE_URL = `${LEAVE_ROUTES_BASE_URL}/leave-plan`;

export const LEAVE_PLAN_ROUTES = {
  post: LEAVE_PLAN_ROUTES_BASE_URL,

  listing: (companyId?: string) =>
    // eslint-disable-next-line sonarjs/no-nested-template-literals
    `${LEAVE_PLAN_ROUTES_BASE_URL}/${LIST}${companyId ? `?companyId=${companyId}` : ""}`,

  get: (currentLeavePlanId: string) =>
    `${LEAVE_PLAN_ROUTES_BASE_URL}/${currentLeavePlanId}`,

  update: (currentLeavePlanId: string) =>
    `${LEAVE_PLAN_ROUTES_BASE_URL}/${currentLeavePlanId}`,

  delete: (currentLeavePlanId: string) =>
    `${LEAVE_PLAN_ROUTES_BASE_URL}/${currentLeavePlanId}`,

  options: (companyId: string) =>
    `${LEAVE_PLAN_ROUTES_BASE_URL}/${OPTIONS}/${companyId}`,
};

export const CONFIGURE_LEAVE_ROUTES = {
  post: LEAVE_PLAN_ROUTES_BASE_URL,

  options: (leavePlanId: string, leaveTypeId: string) =>
    `${LEAVE_PLAN_ROUTES_BASE_URL}/${leavePlanId}/leave-type/${leaveTypeId}/options`,
};

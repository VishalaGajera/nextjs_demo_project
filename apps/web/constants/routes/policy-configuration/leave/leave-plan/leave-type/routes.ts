import { LIST, OPTIONS } from "../../../../../routes";
import { LEAVE_PLAN_ROUTES_BASE_URL } from "../routes";

export const LEAVE_PLAN_TYPE_ROUTES = {
  listing: (leavePlanId: string) =>
    `${LEAVE_PLAN_ROUTES_BASE_URL}/${leavePlanId}/leave-type/${LIST}`,

  add: (leavePlanId: string) =>
    `${LEAVE_PLAN_ROUTES_BASE_URL}/${leavePlanId}/leave-type`,

  delete: (leavePlanId: string, leaveTypeId: string) =>
    `${LEAVE_PLAN_ROUTES_BASE_URL}/${leavePlanId}/leave-type/${leaveTypeId}`,

  options: (leavePlanId: string) =>
    `${LEAVE_PLAN_ROUTES_BASE_URL}/${leavePlanId}/leave-type/${OPTIONS}`,

  optionsPerEmployee: (
    leavePlanId: string,
    employeeId: string,
    fromDate: string
  ) =>
    `${LEAVE_PLAN_ROUTES_BASE_URL}/${leavePlanId}/leave-type/${OPTIONS}/${employeeId}?fromDate=${fromDate}`,
};

export const CONFIGURE_LEAVE_ROUTE = {
  add: (leavePlanId: string, leaveTypeId: string) =>
    `${LEAVE_PLAN_ROUTES_BASE_URL}/${leavePlanId}/leave-type/${leaveTypeId}/setup`,

  get: (leavePlanId: string, leaveTypeId: string) =>
    `${LEAVE_PLAN_ROUTES_BASE_URL}/${leavePlanId}/leave-type/${leaveTypeId}`,

  patch: (leavePlanId: string, leaveTypeId: string) =>
    `${LEAVE_PLAN_ROUTES_BASE_URL}/${leavePlanId}/leave-type/${leaveTypeId}`,
};

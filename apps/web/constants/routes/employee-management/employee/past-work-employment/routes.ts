import { LIST } from "../../../../routes";
import { EMPLOYEE_ROUTES_BASE_URL } from "../routes";

export const EMPLOYEE_PAST_WORK_EMPLOYMENT_ROUTES_BASE_URL =
  "past-work-employment";

export const EMPLOYEE_PAST_WORK_EMPLOYMENT_ROUTES = {
  post: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_PAST_WORK_EMPLOYMENT_ROUTES_BASE_URL}`,

  listing: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_PAST_WORK_EMPLOYMENT_ROUTES_BASE_URL}/${LIST}`,

  delete: (employeeId: string, pastWorkEmploymentId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_PAST_WORK_EMPLOYMENT_ROUTES_BASE_URL}/${pastWorkEmploymentId}`,

  get: (employeeId: string, pastWorkEmploymentId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_PAST_WORK_EMPLOYMENT_ROUTES_BASE_URL}/${pastWorkEmploymentId}`,

  patch: (employeeId: string, pastWorkEmploymentId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_PAST_WORK_EMPLOYMENT_ROUTES_BASE_URL}/${pastWorkEmploymentId}`,
};

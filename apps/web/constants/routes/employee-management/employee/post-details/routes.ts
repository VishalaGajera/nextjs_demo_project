import type { OptionKey } from "../../../../../components/EmployeeManagement/Employee/EmployeeDetails/Tabs/EmployeeWorkPost/Tabs/EmployeeOrganizationDetails/BusinessUnit/Dialogs/EditBusinessUnitDialog/hooks/useTabOptions";
import type { SectionKeys } from "../../../../../components/EmployeeManagement/Employee/EmployeeDetails/Tabs/EmployeeWorkPost/Tabs/EmployeePostDetails/hooks/useGetPostDetails";
import { HISTORY } from "../../../../routes";
import { EMPLOYEE_ROUTES_BASE_URL } from "../routes";

export const EMPLOYEE_POST_DETAILS_ROUTES_BASE_URL = "post-details";

export const EMPLOYEE_POST_DETAILS_ROUTES = {
  get: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_POST_DETAILS_ROUTES_BASE_URL}`,

  getSectionPost: (employeeId: string, section?: SectionKeys) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_POST_DETAILS_ROUTES_BASE_URL}${section ? "?section=" + section : ""}`,

  getHistory: (employeeId: string, section: SectionKeys) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_POST_DETAILS_ROUTES_BASE_URL}/${HISTORY}?section=${section}`,

  patch: (employeeId: string, operationType: OptionKey) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_POST_DETAILS_ROUTES_BASE_URL}?operationType=${operationType}`,
};

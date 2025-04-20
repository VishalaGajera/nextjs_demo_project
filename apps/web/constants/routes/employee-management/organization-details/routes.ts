import type { OptionKey } from "../../../../components/EmployeeManagement/Employee/EmployeeDetails/Tabs/EmployeeWorkPost/Tabs/EmployeeOrganizationDetails/BusinessUnit/Dialogs/EditBusinessUnitDialog/hooks/useTabOptions";
import type { SectionKeys } from "../../../../components/EmployeeManagement/Employee/EmployeeDetails/Tabs/EmployeeWorkPost/Tabs/EmployeeOrganizationDetails/hooks/useGetOrganizationDetails";
import { HISTORY } from "../../../routes";
import { EMPLOYEE_ROUTES_BASE_URL } from "../employee/routes";

export const EMPLOYEE_ORGANIZATION_DETAILS_ROUTES_BASE_URL =
  "organization-details";

export const EMPLOYEE_ORGANIZATION_DETAILS_ROUTES = {
  post: (employeeId: string, section: SectionKeys) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_ORGANIZATION_DETAILS_ROUTES_BASE_URL}/${HISTORY}?section=${section}`,

  get: (employeeId: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_ORGANIZATION_DETAILS_ROUTES_BASE_URL}`,

  patch: (employeeId: string, operationType: OptionKey) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_ORGANIZATION_DETAILS_ROUTES_BASE_URL}?operationType=${operationType}`,

  getSection: (employeeId: string, section: SectionKeys) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_ORGANIZATION_DETAILS_ROUTES_BASE_URL}?section=${section}`,
};

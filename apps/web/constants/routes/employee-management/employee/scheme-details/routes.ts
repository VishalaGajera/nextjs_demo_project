import type { OptionKey } from "../../../../../components/EmployeeManagement/Employee/EmployeeDetails/Tabs/EmployeeWorkPost/Tabs/EmployeeOrganizationDetails/BusinessUnit/Dialogs/EditBusinessUnitDialog/hooks/useTabOptions";
import type { SectionKeys } from "../../../../../components/EmployeeManagement/Employee/EmployeeDetails/Tabs/EmployeeWorkPost/Tabs/EmployeeSchemaDetails/hooks/useGetSchemaDetails";
import { HISTORY } from "../../../../routes";

import { EMPLOYEE_ROUTES_BASE_URL } from "../routes";

export const EMPLOYEE_SCHEME_DETAILS_ROUTES_BASE_URL = "scheme-details";

export const EMPLOYEE_SCHEME_DETAILS_ROUTES = {
  getDetails: (employeeId: string, currentDate: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_SCHEME_DETAILS_ROUTES_BASE_URL}?currentDate=${currentDate}`,

  get: (employeeId: string, section: SectionKeys, currentDate: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_SCHEME_DETAILS_ROUTES_BASE_URL}?section=${section}&currentDate=${currentDate}`,

  getHistory: (employeeId: string, section: SectionKeys, currentDate: string) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_SCHEME_DETAILS_ROUTES_BASE_URL}/${HISTORY}?section=${section}&currentDate=${currentDate}`,

  patch: (
    employeeId: string,
    section: SectionKeys,
    operationType: OptionKey,
    currentDate: string
  ) =>
    `${EMPLOYEE_ROUTES_BASE_URL}/${employeeId}/${EMPLOYEE_SCHEME_DETAILS_ROUTES_BASE_URL}/${section}?operationType=${operationType}&currentDate=${currentDate}`,
};

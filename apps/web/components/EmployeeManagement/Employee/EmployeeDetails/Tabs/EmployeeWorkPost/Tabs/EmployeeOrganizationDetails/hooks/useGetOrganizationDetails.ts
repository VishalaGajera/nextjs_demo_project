import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { employeeOrganizationDetails } from "../../../../../../../../../queryKeysFactories/employeeOrganizationDetails";
import type { ApiSuccessResponse } from "../../../../../../../../../types/apiResponse";
import { EMPLOYEE_ORGANIZATION_DETAILS_ROUTES } from "../../../../../../../../../constants/routes/employee-management/organization-details/routes";

export type EmployeeOrganizationDetails = {
  company: {
    id: string;
    name: string;
    action_by: string;
    action_at: string;
  };
  business_unit: {
    id: string;
    name: string;
    remark: string;
    effective_from: string;
    action_by: string;
    action_at: string;
  };
  business_unit_location: {
    id: string;
    name: string;
    remark: string;
    effective_from: string;
    action_by: string;
    action_at: string;
  };
  reporting_manager: {
    id: string;
    name: string;
    remark: string;
    effective_from: string;
    action_by: string;
    action_at: string;
  };
};

export type SectionKeys = keyof EmployeeOrganizationDetails;

type UseGetOrganizationDetailArgs = {
  employeeId: string;
};

export function useGetEmployeeOrganizationDetails({
  employeeId,
}: UseGetOrganizationDetailArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEmployeeOrganizationDetails = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<EmployeeOrganizationDetails>
    >(EMPLOYEE_ORGANIZATION_DETAILS_ROUTES.get(employeeId));

    return data.data;
  };

  return useQuery({
    queryKey: employeeOrganizationDetails.get(employeeId),
    queryFn: fetchEmployeeOrganizationDetails,
    enabled: !!employeeId,
  });
}

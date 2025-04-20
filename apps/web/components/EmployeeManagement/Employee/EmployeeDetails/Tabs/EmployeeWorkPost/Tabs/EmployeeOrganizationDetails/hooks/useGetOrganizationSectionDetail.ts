import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { employeeOrganizationDetails } from "../../../../../../../../../queryKeysFactories/employeeOrganizationDetails";
import type { ApiSuccessResponse } from "../../../../../../../../../types/apiResponse";
import type { SectionKeys } from "./useGetOrganizationDetails";
import { EMPLOYEE_ORGANIZATION_DETAILS_ROUTES } from "../../../../../../../../../constants/routes/employee-management/organization-details/routes";

export type EmployeeOrganizationDetails = {
  id: string;
  name: string;
  action_by: string;
  action_at: string;
  effective_from: string;
  remark: string;
  joining_date: string;
};

type UseGetOrganizationSectionDetailArgs = {
  employeeId: string;
  section: SectionKeys;
};

export function useGetEmployeeOrganizationSectionDetail({
  employeeId,
  section,
}: UseGetOrganizationSectionDetailArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEmployeeOrganizationDetails = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<EmployeeOrganizationDetails>
    >(EMPLOYEE_ORGANIZATION_DETAILS_ROUTES.getSection(employeeId, section));

    return data.data;
  };

  return useQuery({
    queryKey: employeeOrganizationDetails.get(employeeId, section),
    queryFn: fetchEmployeeOrganizationDetails,
    enabled: !!employeeId,
  });
}

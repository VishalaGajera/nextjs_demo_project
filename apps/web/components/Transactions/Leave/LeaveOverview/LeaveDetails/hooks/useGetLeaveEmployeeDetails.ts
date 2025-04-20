import { useQuery } from "@tanstack/react-query";
import { LEAVE_OVERVIEW_ROUTES } from "../../../../../../constants/routes/transactions/leave/leave-overview/route";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { leaveOverviewKey } from "../../../../../../queryKeysFactories/leaveOverview";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

export type LeaveEmployeeDetails = {
  id: string;
  employee_name: string;
  avatar: string;
  joining_date: string;
  company_id: string;
  leave_plan_id: string;
  leave_plan_year_start_month: number;
  designation_name: string;
};

type UseGetLeaveEmployeeDetailsArgs = {
  employeeId: string;
};
export function useGetLeaveEmployeeDetails({
  employeeId,
}: UseGetLeaveEmployeeDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEmployeeDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<LeaveEmployeeDetails>>(
      LEAVE_OVERVIEW_ROUTES.getLeaveEmployeeDetails(employeeId)
    );

    return data;
  };

  return useQuery({
    queryKey: leaveOverviewKey.getLeaveEmployee(employeeId),
    queryFn: fetchEmployeeDetails,
    enabled: !!employeeId,
  });
}

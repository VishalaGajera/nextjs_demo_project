import { useQuery } from "@tanstack/react-query";
import type { NestedFieldPaths } from "ag-grid-community";
import { LEAVE_ROUTES } from "../../../../constants/routes/policy-configuration/leave/leave-type/routes";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { leaveTypeKeys } from "../../../../queryKeysFactories/LeaveType";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { LeaveEmployeeData } from "../../../Transactions/Leave/LeaveOverview/LeaveOverviewList/hooks/useGetLeaveOverviewEmployees";

export type LeaveTypeOptions = {
  id: string;
  name: NestedFieldPaths<LeaveEmployeeData>;
};

type UseGetLeaveTypePerCompanyOptionArgs = {
  companyId: string;
};

export function useGetLeaveTypePerCompanyOptions({
  companyId,
}: UseGetLeaveTypePerCompanyOptionArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLeaveTypePerCompanyOptions = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<LeaveTypeOptions[]>
    >(LEAVE_ROUTES.optionsPerCompany(companyId));

    return data.data;
  };

  return useQuery({
    queryKey: leaveTypeKeys.optionsPerCompany(companyId),
    queryFn: fetchLeaveTypePerCompanyOptions,
    enabled: !!companyId,
    initialData: [],
  });
}

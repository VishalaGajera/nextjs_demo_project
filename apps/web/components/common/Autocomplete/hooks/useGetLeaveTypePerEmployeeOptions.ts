import { useQuery } from "@tanstack/react-query";
import { LEAVE_PLAN_TYPE_ROUTES } from "../../../../constants/routes/policy-configuration/leave/leave-plan/leave-type/routes";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { leavePlanTypeKeys } from "../../../../queryKeysFactories/leavePlan";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";

type UseGetLeaveTypePerEmployeeOptionArgs = {
  leavePlanId: string;
  employeeId: string;
  fromDate: string;
};

export function useGetLeaveTypePerEmployeeOptions({
  leavePlanId,
  employeeId,
  fromDate,
}: UseGetLeaveTypePerEmployeeOptionArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLeaveTypePerEmployeeOptions = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      LEAVE_PLAN_TYPE_ROUTES.optionsPerEmployee(
        leavePlanId,
        employeeId,
        fromDate
      )
    );

    return data.data;
  };

  return useQuery({
    queryKey: leavePlanTypeKeys.optionsPerEmployee(
      leavePlanId,
      employeeId,
      fromDate
    ),
    queryFn: fetchLeaveTypePerEmployeeOptions,
    enabled: !!leavePlanId && !!employeeId && !!fromDate,
    initialData: [],
  });
}

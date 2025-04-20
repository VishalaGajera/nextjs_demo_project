import { useQuery } from "@tanstack/react-query";
import { CONFIGURE_LEAVE_ROUTES } from "../../../../constants/routes/policy-configuration/leave/leave-plan/routes";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { configureLeaveKeys } from "../../../../queryKeysFactories/leavePlan";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";

type UseLeaveTypeCategoryArgs = {
  leavePlanId: string;
  leaveTypeId: string;
};

export function useGetLeaveTypeCategoryOptionsQueryFn({
  leavePlanId,
  leaveTypeId,
}: UseLeaveTypeCategoryArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLeaveTypeCategory = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      CONFIGURE_LEAVE_ROUTES.options(leavePlanId, leaveTypeId)
    );

    return data.data;
  };

  return { fetchLeaveTypeCategory };
}
export function useGetLeaveTypeCategoryOptions({
  leavePlanId,
  leaveTypeId,
}: UseLeaveTypeCategoryArgs) {
  const { fetchLeaveTypeCategory } = useGetLeaveTypeCategoryOptionsQueryFn({
    leavePlanId,
    leaveTypeId,
  });

  return useQuery({
    queryKey: configureLeaveKeys.options(leavePlanId, leaveTypeId),
    queryFn: fetchLeaveTypeCategory,
    enabled: !!leavePlanId || !!leaveTypeId,
    initialData: [],
  });
}

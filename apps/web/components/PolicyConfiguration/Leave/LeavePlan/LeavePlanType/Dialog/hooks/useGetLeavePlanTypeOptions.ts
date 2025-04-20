import { useQuery } from "@tanstack/react-query";
import { LEAVE_ROUTES } from "../../../../../../../constants/routes/policy-configuration/leave/leave-type/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { leaveTypeKeys } from "../../../../../../../queryKeysFactories/LeaveType";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";

type UseGetLeavePlanTypeOptionsArgs = {
  leavePlanId: string;
};

export type LeavePlanTypeOption = {
  id: string;
  name: string;
  is_blocked: boolean;
};

export function useGetLeavePlanTypeOptions({
  leavePlanId,
}: UseGetLeavePlanTypeOptionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLeavePlanTypeOption = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<LeavePlanTypeOption[]>
    >(LEAVE_ROUTES.options(leavePlanId));

    return data.data;
  };

  return useQuery({
    queryKey: leaveTypeKeys.options(leavePlanId),
    queryFn: fetchLeavePlanTypeOption,
    initialData: [],
  });
}

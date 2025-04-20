import { useQuery } from "@tanstack/react-query";
import { CONFIGURE_LEAVE_ROUTE } from "../../../../../../constants/routes/policy-configuration/leave/leave-plan/leave-type/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { leaveTypeKeys } from "../../../../../../queryKeysFactories/LeaveType";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { LeaveConfigurePayload } from "./useSetupConfigureLeave";

type UseGetLeavePlanTypeOptionsArgs = {
  leavePlanId: string;
  leaveTypeId: string;
};

export function useGetSetupConfigureLeave({
  leavePlanId,
  leaveTypeId,
}: UseGetLeavePlanTypeOptionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchSetupConfigureLeave = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<LeaveConfigurePayload>
    >(CONFIGURE_LEAVE_ROUTE.get(leavePlanId, leaveTypeId));

    return data.data;
  };

  return useQuery({
    queryKey: leaveTypeKeys.get(leavePlanId),
    queryFn: fetchSetupConfigureLeave,
    initialData: null,
  });
}

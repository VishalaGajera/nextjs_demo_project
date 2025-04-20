import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { CONFIGURE_LEAVE_ROUTE } from "../../../../../../constants/routes/policy-configuration/leave/leave-plan/leave-type/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { configureLeaveKeys } from "../../../../../../queryKeysFactories/leavePlan";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { LeaveConfigurePayload } from "./useSetupConfigureLeave";

type useEditSetupConfigureLeaveArgs = {
  leavePlanId: string;
  leaveTypeId: string;
  options: UseMutationOptions<
    ApiSuccessResponse<LeaveConfigurePayload>,
    ApiErrorResponse,
    Partial<LeaveConfigurePayload>
  >;
};

export function useEditSetupConfigureLeave({
  options = {},
  leavePlanId,
  leaveTypeId,
}: useEditSetupConfigureLeaveArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: configureLeaveKeys.edit(leavePlanId, leaveTypeId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<
        ApiSuccessResponse<LeaveConfigurePayload>
      >(CONFIGURE_LEAVE_ROUTE.patch(leavePlanId, leaveTypeId), formValues);

      return data;
    },
    ...options,
  });
}

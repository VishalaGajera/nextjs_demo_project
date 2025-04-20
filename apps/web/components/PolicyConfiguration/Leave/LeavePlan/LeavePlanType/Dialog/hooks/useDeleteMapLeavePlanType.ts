"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { LEAVE_PLAN_TYPE_ROUTES } from "../../../../../../../constants/routes/policy-configuration/leave/leave-plan/leave-type/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { leavePlanTypeKeys } from "../../../../../../../queryKeysFactories/leavePlan";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import type { LeaveTypeList } from "../../LeavePlanTypeList/hooks/useGetLeavePlanTypeListColumns";

type UseDeleteMapLeavePlanTypeArgs = {
  options: UseMutationOptions<
    ApiSuccessResponse<LeaveTypeList>,
    ApiErrorResponse
  >;
  leavePlanId: string;
  leaveTypeId: string;
};

export function useDeleteMapLeavePlanType({
  leavePlanId,
  leaveTypeId,
  options = {},
}: UseDeleteMapLeavePlanTypeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: leavePlanTypeKeys.delete(leavePlanId, leaveTypeId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<
        ApiSuccessResponse<LeaveTypeList>
      >(LEAVE_PLAN_TYPE_ROUTES.delete(leavePlanId, leaveTypeId));

      return data;
    },
    ...options,
  });
}

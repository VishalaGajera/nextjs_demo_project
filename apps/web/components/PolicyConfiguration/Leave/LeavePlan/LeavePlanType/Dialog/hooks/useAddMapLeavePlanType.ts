import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { LEAVE_PLAN_TYPE_ROUTES } from "../../../../../../../constants/routes/policy-configuration/leave/leave-plan/leave-type/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { leavePlanTypeKeys } from "../../../../../../../queryKeysFactories/leavePlan";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import type { MapLeavePlanTypeFormFieldValues } from "../MapLeavePlanTypeForm";

export type LeaveTypeOptionIds = {
  leave_type_ids: string[];
};

type UseMapLeavePlanTypeArgs = {
  leavePlanId: string;
  options: UseMutationOptions<
    ApiSuccessResponse<LeaveTypeOptionIds>,
    ApiErrorResponse<MapLeavePlanTypeFormFieldValues>,
    Partial<LeaveTypeOptionIds>
  >;
};

export function useAddMapLeavePlanType({
  options = {},
  leavePlanId,
}: UseMapLeavePlanTypeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: leavePlanTypeKeys.add(leavePlanId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<
        ApiSuccessResponse<LeaveTypeOptionIds>
      >(LEAVE_PLAN_TYPE_ROUTES.add(leavePlanId), formValues);

      return data;
    },
    ...options,
  });
}

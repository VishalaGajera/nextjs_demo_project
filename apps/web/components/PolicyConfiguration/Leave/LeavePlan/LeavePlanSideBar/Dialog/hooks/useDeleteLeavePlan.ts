import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { LEAVE_PLAN_ROUTES } from "../../../../../../../constants/routes/policy-configuration/leave/leave-plan/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { leavePlanKeys } from "../../../../../../../queryKeysFactories/leavePlan";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import type { LeavePlanListData } from "../../hooks/useGetLeavePlanList";

type UseDeleteLeavePlanArgs = {
  options: UseMutationOptions<
    ApiSuccessResponse<LeavePlanListData>,
    ApiErrorResponse
  >;
  currentLeavePlanId: string;
};

export function useDeleteLeavePlan({
  currentLeavePlanId,
  options = {},
}: UseDeleteLeavePlanArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: leavePlanKeys.delete(currentLeavePlanId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<
        ApiSuccessResponse<LeavePlanListData>
      >(LEAVE_PLAN_ROUTES.delete(currentLeavePlanId));

      return data;
    },
    ...options,
  });
}

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { LEAVE_PLAN_ROUTES } from "../../../../../../../constants/routes/policy-configuration/leave/leave-plan/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { leavePlanKeys } from "../../../../../../../queryKeysFactories/leavePlan";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import type { LeavePlanFormFieldValues } from "../LeavePlanForm";
import type { LeavePlanPayload } from "./useAddLeavePlan";

type EditLeavePlan = {
  leave_plan_name: string;
  description: string;
};

type UseEditLeavePlanArgs = {
  currentLeavePlanId: string;
  options: UseMutationOptions<
    ApiSuccessResponse<EditLeavePlan>,
    ApiErrorResponse<LeavePlanFormFieldValues>,
    Partial<LeavePlanPayload>
  >;
};

export function useEditLeavePlan({
  options = {},
  currentLeavePlanId,
}: UseEditLeavePlanArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: leavePlanKeys.edit(currentLeavePlanId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<
        ApiSuccessResponse<EditLeavePlan>
      >(LEAVE_PLAN_ROUTES.update(currentLeavePlanId), formValues);

      return data;
    },
    ...options,
  });
}

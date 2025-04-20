import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { LEAVE_PLAN_ROUTES } from "../../../../../../../constants/routes/policy-configuration/leave/leave-plan/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { leavePlanKeys } from "../../../../../../../queryKeysFactories/leavePlan";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import type { LeavePlanFormFieldValues } from "../LeavePlanForm";

type LeavePlan = {
  company_id: string;
  leave_plan_name: string;
  year_start_month: number;
  start_year: string;
  description: string;
};

export type LeavePlanPayload = Omit<
  LeavePlanFormFieldValues,
  "year_start_month"
> & {
  year_start_month: number | null | string;
  start_year: number | null;
};

type UseAddLeavePlanArgs = {
  options: UseMutationOptions<
    ApiSuccessResponse<LeavePlan>,
    ApiErrorResponse<LeavePlanFormFieldValues>,
    Partial<LeavePlanPayload>
  >;
};

export function useAddLeavePlan({ options = {} }: UseAddLeavePlanArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: leavePlanKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<ApiSuccessResponse<LeavePlan>>(
        LEAVE_PLAN_ROUTES.post,
        formValues
      );

      return data;
    },
    ...options,
  });
}

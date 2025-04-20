import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { CONFIGURE_LEAVE_ROUTE } from "../../../../../../constants/routes/policy-configuration/leave/leave-plan/leave-type/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { configureLeaveKeys } from "../../../../../../queryKeysFactories/leavePlan";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { ConfigureLeaveFormFieldValues } from "../ConfigureLeaveForm/ConfigureLeaveForm";

type response = {
  message: string;
  data: null;
};

type LevelApprover = {
  approver_type: string;
  employee_id: string;
};

type ApprovalLevel = {
  is_auto_approve_days_enabled: boolean;
  level_approvers?: LevelApprover[];
  auto_approve_days?: number | null;
};

type LeaveApprovalPayload = {
  is_approval_required: boolean;
  skip_if_approver_does_not_exist?: boolean;
  approval_levels?: ApprovalLevel[];
};

export type LeaveConfigurePayload = Omit<
  ConfigureLeaveFormFieldValues,
  "leave_approval"
> & {
  leave_approval: LeaveApprovalPayload;
};

type UseSetupConfigureLeaveArgs = {
  leavePlanId: string;
  leaveTypeId: string;
  options: UseMutationOptions<
    ApiSuccessResponse<response>,
    ApiErrorResponse,
    Partial<LeaveConfigurePayload>
  >;
};

export function useSetupConfigureLeave({
  options = {},
  leavePlanId,
  leaveTypeId,
}: UseSetupConfigureLeaveArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: configureLeaveKeys.add(leavePlanId, leaveTypeId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<ApiSuccessResponse<response>>(
        CONFIGURE_LEAVE_ROUTE.add(leavePlanId, leaveTypeId),
        formValues
      );

      return data;
    },
    ...options,
  });
}

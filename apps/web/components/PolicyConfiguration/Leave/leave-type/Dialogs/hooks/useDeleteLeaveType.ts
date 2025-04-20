"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { LEAVE_ROUTES } from "../../../../../../constants/routes/policy-configuration/leave/leave-type/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { leaveTypeKeys } from "../../../../../../queryKeysFactories/LeaveType";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { LeaveType } from "../../LeaveTypeList/hooks/useGetLeaveTypesList";

type DeleteLeaveTypeApiResponse = ApiSuccessResponse<LeaveType>;

type UseDeleteLeaveTypeArgs = {
  options: UseMutationOptions<DeleteLeaveTypeApiResponse, ApiErrorResponse>;
  leaveTypeId: string;
};

export function useDeleteLeaveType({
  leaveTypeId,
  options = {},
}: UseDeleteLeaveTypeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: leaveTypeKeys.delete(leaveTypeId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteLeaveTypeApiResponse>(
        LEAVE_ROUTES.delete(leaveTypeId)
      );

      return data;
    },
    ...options,
  });
}

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
import type { LeaveTypeFormFieldValues } from "../LeaveTypeForm";

type EditLeaveTypeApiResponse = ApiSuccessResponse<LeaveType>;

type UseEditLeaveTypeArgs = {
  options: UseMutationOptions<
    EditLeaveTypeApiResponse,
    ApiErrorResponse,
    Partial<LeaveTypeFormFieldValues>
  >;
  leaveTypeId: string;
};

export function useEditLeaveType({
  leaveTypeId,
  options = {},
}: UseEditLeaveTypeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: leaveTypeKeys.edit(leaveTypeId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditLeaveTypeApiResponse>(
        LEAVE_ROUTES.patch(leaveTypeId),
        formValues
      );

      return data;
    },
    ...options,
  });
}

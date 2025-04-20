"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { LEAVE_ROUTES } from "../../../../../../constants/routes/policy-configuration/leave/leave-type/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { leaveTypeKeys } from "../../../../../../queryKeysFactories/LeaveType";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { LeaveType } from "../../LeaveTypeList/hooks/useGetLeaveTypesList";
import type { LeaveTypeFormFieldValues } from "../LeaveTypeForm";

export type PayloadLeaveType = Partial<{
  company_id: string | null;
  leave_type: string | null;
  leave_type_code: string | null;
  leave_type_name: string | null;
  description: string | null;
  is_sick_leave: boolean | null;
  applicable_to_gender: string | null;
  applicable_to_marital_status: string | null;
  leave_reasons: string[] | null;
  colour_code: string | null;
}>;

type AddLeaveTypeApiSuccessResponse = ApiSuccessResponse<LeaveType>;

type UseAddLeaveTypeArgs = {
  options: UseMutationOptions<
    AddLeaveTypeApiSuccessResponse,
    ApiErrorResponse,
    Partial<LeaveTypeFormFieldValues>
  >;
};

export function useAddLeaveType({ options = {} }: UseAddLeaveTypeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: leaveTypeKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddLeaveTypeApiSuccessResponse>(
        LEAVE_ROUTES.post,
        formValues
      );

      return data;
    },
    ...options,
  });
}

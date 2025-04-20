"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { OVERTIME_REQUEST_ROUTES } from "../../../../../../../constants/routes/transactions/attendance/attendance-overview/overtime-request/route";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { overTimeRequestKeys } from "../../../../../../../queryKeysFactories/Transaction/Attendance/AttendanceOverview/OvertimeRequest";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import type { OvertimeRequestFormFieldValues } from "../AddOvertimeRequestForm";

type AddOvertimeRequestApiSuccessResponse = ApiSuccessResponse<{
  message: string;
  data: string;
}>;

type UseAddOvertimeRequestArgs = {
  employeeId: string;
  options: UseMutationOptions<
    AddOvertimeRequestApiSuccessResponse,
    ApiErrorResponse<OvertimeRequestFormFieldValues>,
    Partial<OvertimeRequestFormFieldValues>
  >;
};

export function useAddOvertimeRequest({
  options = {},
  employeeId,
}: UseAddOvertimeRequestArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: overTimeRequestKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddOvertimeRequestApiSuccessResponse>(
          OVERTIME_REQUEST_ROUTES.add(employeeId),
          formValues
        );

      return data;
    },
    ...options,
  });
}

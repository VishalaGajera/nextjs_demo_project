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
import type { OvertimeRequestFormFieldValues } from "../../Add/AddOvertimeRequestForm";
import type { RequestOtFormFieldValues } from "../Dialogs/RequestOtForm";

type StatusOvertimeRequestApiSuccessResponse = ApiSuccessResponse<{
  message: string;
  data: string;
}>;

type OvertimeRequestFormFieldValuesWithStatus =
  OvertimeRequestFormFieldValues & {
    status: RequestOtFormFieldValues["status"];
  };

type UseStatusOvertimeRequestArgs = {
  options: UseMutationOptions<
    StatusOvertimeRequestApiSuccessResponse,
    ApiErrorResponse<OvertimeRequestFormFieldValuesWithStatus>,
    Partial<OvertimeRequestFormFieldValuesWithStatus>
  >;
  OTRequestId: string;
  employeeId: string;
  status: string;
};

export function useStatusOvertimeRequest({
  OTRequestId,
  options = {},
  employeeId,
  status,
}: UseStatusOvertimeRequestArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: overTimeRequestKeys.status(OTRequestId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<StatusOvertimeRequestApiSuccessResponse>(
          OVERTIME_REQUEST_ROUTES.status(employeeId, OTRequestId, status),
          formValues
        );

      return data;
    },
    ...options,
  });
}

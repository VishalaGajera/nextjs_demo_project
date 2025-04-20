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

type EditOvertimeRequestApiSuccessResponse = ApiSuccessResponse<{
  message: string;
  data: string;
}>;

type OvertimeRequestFormFieldValuesWithStatus =
  OvertimeRequestFormFieldValues & {
    status: RequestOtFormFieldValues["status"];
  };

type UseEditOvertimeRequestArgs = {
  options: UseMutationOptions<
    EditOvertimeRequestApiSuccessResponse,
    ApiErrorResponse<OvertimeRequestFormFieldValuesWithStatus>,
    Partial<OvertimeRequestFormFieldValuesWithStatus>
  >;
  OTRequestId: string;
  employeeId: string;
};

export function useEditOvertimeRequest({
  OTRequestId,
  options = {},
  employeeId,
}: UseEditOvertimeRequestArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: overTimeRequestKeys.edit(OTRequestId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditOvertimeRequestApiSuccessResponse>(
          OVERTIME_REQUEST_ROUTES.edit(employeeId, OTRequestId),
          formValues
        );

      return data;
    },
    ...options,
  });
}

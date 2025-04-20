"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { ATTENDANCE_OVERVIEW_ROUTES } from "../../../../../../constants/routes/transactions/attendance/attendance-overview/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { attendanceViewKey } from "../../../../../../queryKeysFactories/attendanceView";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { AttendancePayload } from "./type";

type AddAttendanceApiSuccessResponse = ApiSuccessResponse<Location>;

type UseAddLocationUnitArgs = {
  options: UseMutationOptions<
    AddAttendanceApiSuccessResponse,
    ApiErrorResponse<AttendancePayload>,
    Partial<AttendancePayload>
  >;
};

export function useAddAttendance({ options = {} }: UseAddLocationUnitArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: attendanceViewKey.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddAttendanceApiSuccessResponse>(
        ATTENDANCE_OVERVIEW_ROUTES.post,
        formValues
      );

      return data;
    },
    ...options,
  });
}

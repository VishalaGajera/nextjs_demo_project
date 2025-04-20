"use client";

import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { ATTENDANCE_OVERVIEW_ROUTES } from "../../../../../../constants/routes/transactions/attendance/attendance-overview/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { attendanceDetailsKey } from "../../../../../../queryKeysFactories/attendanceView";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { AttendanceDetailsMeta } from "./type";

type UseGetAttendanceDetailsMetaArgs = {
  selectedEmployeeId: string;
  date: string;
};

export function useGetAttendanceDetailsMeta({
  selectedEmployeeId,
  date,
}: UseGetAttendanceDetailsMetaArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const currentDate = DateTime.fromISO(date).toFormat("yyyy-MM");

  const currentFullDate = DateTime.now().toFormat("yyyy-MM-dd");

  const fetchAttendanceDetailsMeta = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<AttendanceDetailsMeta>>(
      ATTENDANCE_OVERVIEW_ROUTES.getMeta(
        selectedEmployeeId,
        currentDate,
        currentFullDate
      )
    );

    return data;
  };

  return useQuery({
    queryKey: attendanceDetailsKey.getMeta(
      selectedEmployeeId,
      date,
      currentFullDate
    ),
    queryFn: () => fetchAttendanceDetailsMeta(),
    enabled: !!selectedEmployeeId && !!date,
    initialData: {} as AttendanceDetailsMeta,
  });
}

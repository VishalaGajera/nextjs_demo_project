"use client";

import { Stack } from "@mui/material";
import { DateTime } from "luxon";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { AttendanceDetailsHeader } from "../../../../../../../components/AttendanceDetails/AttendanceDetailsHeader/AttendanceDetailsHeader";
import { AttendanceDetailsView } from "../../../../../../../components/AttendanceDetails/AttendanceDetailsView/AttendanceDetailsView";
import { AttendanceSummary } from "../../../../../../../components/AttendanceDetails/AttendanceSummary/AttendanceSummary";
import { useGetAttendanceDetails } from "../../../../../../../components/AttendanceDetails/AttendanceSummary/hooks/useGetAttendanceDetails";
import { AttendanceDetailsBreadCrumbs } from "../../../../../../../components/Transactions/Attendance/AttendanceOverview/AttendanceDetailsBreadCrumbs";
import { Debounce_Delay } from "../../../../../../../utils/helper";

export type PageProps = Readonly<{
  params: {
    employeeId: string;
    page?: string;
  };
}>;

export default function Page({ params }: PageProps) {
  const { control, watch } = useForm({
    defaultValues: {
      datePeriod: DateTime.now().toFormat("yyyy-MM"),
    },
  });

  const { employeeId } = params;

  const [date] = useDebounceValue(
    DateTime.fromISO(watch("datePeriod")).toFormat("yyyy-MM"),
    Debounce_Delay
  );

  const [currentDate] = useDebounceValue(
    DateTime.now().toISODate(),
    Debounce_Delay
  );

  const { data, isFetching } = useGetAttendanceDetails({
    employeeId,
    date,
    currentDate,
  });

  return (
    <Stack gap="10px">
      <AttendanceDetailsBreadCrumbs />

      <AttendanceDetailsHeader
        employeeId={employeeId}
        control={control}
        date={date}
      />

      <AttendanceSummary
        employeeData={data}
        employeeId={employeeId}
        isLoading={isFetching}
      />

      <AttendanceDetailsView
        employeeId={employeeId}
        attendanceDetails={data}
        isLoading={isFetching}
        date={date}
        stickValue={380}
      />
    </Stack>
  );
}

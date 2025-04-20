"use client";

import { SeverityIndicator, type WorkDayType } from "@codezee/sixtify-brahma";
import { Box, Tabs as MuiTabs, Stack, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useSearchParams } from "next/navigation";
import { type ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { employeeBasicDetailsKeys } from "../../../queryKeysFactories/employee";
import type { EmployeeBasicDetails } from "../../EmployeeManagement/Employee/EmployeeDetails/EmployeeBasicDetails/hooks/useGetEmployeeBasicDetails";
import { useGetAttendanceDetailsMeta } from "../../Transactions/Attendance/AttendanceOverview/Dialogs/hooks/UseGetAttendanceDetailsMeta";
import type { AttendanceDetails } from "../AttendanceSummary/hooks/type";
import { useGetSeverityIndicatorOptions } from "./hooks/useGetSeverityIndicatorOptions";
import type { OptionKey } from "./hooks/useTabOptions";
import { useTabOptions } from "./hooks/useTabOptions";
import { AttendanceListView } from "./Tabs/AttendanceListView/AttendanceListView";
import { CalendarView } from "./Tabs/CalendarView/CalendarView";
import { OvertimeRequest } from "./Tabs/OvertimeRequest/OvertimeRequest";

type AttendanceDetailsViewArgs = Readonly<{
  employeeId: string;
  attendanceDetails: AttendanceDetails;
  isLoading: boolean;
  date?: string;
  stickValue?: number;
}>;

export function AttendanceDetailsView({
  employeeId,
  attendanceDetails,
  isLoading,
  date = DateTime.now().toFormat("yyyy-MM"),
  stickValue = 0,
}: AttendanceDetailsViewArgs) {
  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  const { data } = useGetAttendanceDetailsMeta({
    selectedEmployeeId: employeeId,
    date,
  });

  const isOvertimeRequestTabEnabled = data.is_overtime_request_tab_enabled;

  const { menuItems } = useTabOptions({
    employeeId,
    isOvertimeRequestTabEnabled,
  });

  const searchParams = useSearchParams();

  const dateTime = DateTime.fromFormat(date, "yyyy-MM");

  const year = dateTime.year;

  const month = dateTime.month;

  const queryClient = useQueryClient();

  const cachedData = queryClient.getQueryData<EmployeeBasicDetails>(
    employeeBasicDetailsKeys.get(employeeId)
  );

  const joiningData = cachedData?.joining_date
    ? DateTime.fromISO(cachedData.joining_date).toFormat("yyyy-LL-dd")
    : "";

  const filterData = attendanceDetails.attendance_records?.filter(
    (item) => item.date >= joiningData
  );

  const categoryRenderer: Record<OptionKey, ReactNode> = {
    list_view: (
      <AttendanceListView
        attendanceRecords={filterData}
        isLoading={isLoading}
        employeeId={employeeId}
        date={date}
        stickValue={stickValue}
        joiningData={joiningData}
      />
    ),
    calendar_view: (
      <CalendarView
        attendanceRecords={attendanceDetails.attendance_records}
        year={year}
        month={month}
        isLoading={isLoading}
        employeeId={employeeId}
        joiningData={joiningData}
      />
    ),
    overtime_request: (
      <OvertimeRequest
        attendanceDetails={attendanceDetails}
        employeeId={employeeId}
        date={date}
        metaData={data}
      />
    ),
  };

  const tab = searchParams.get("view");

  const customWorkdayTypeValues: WorkDayType[] = [
    "present",
    "absent",
    "weekly_off",
    "holiday",
    "paid_leave",
    "unpaid_leave",
    "late_in_early_out",
  ];

  const { options } = useGetSeverityIndicatorOptions({
    customSeverityOptions: customWorkdayTypeValues,
  });

  return (
    <Stack gap="10px">
      <Stack
        flexDirection="row"
        bgcolor={lightBlue[50]}
        justifyContent="space-between"
        borderRadius="5px"
        alignItems="center"
      >
        <MuiTabs
          value={tab}
          aria-label="secondary tabs example "
          sx={{
            borderRadius: "5px",
          }}
        >
          {menuItems.map((item) => (
            <Tab
              key={item.value}
              value={item.value}
              label={item.title}
              onClick={item.onClick}
            />
          ))}
        </MuiTabs>

        <Stack flexDirection="row" gap="5px">
          {options.map((item) => (
            <SeverityIndicator
              key={uuidv4()}
              color={item.color}
              label={item.title}
              isBackground={false}
            />
          ))}
        </Stack>
      </Stack>

      <Box bgcolor={lightBlue[50]} sx={{ borderRadius: "5px" }}>
        {tab && categoryRenderer[tab as OptionKey]}
      </Box>
    </Stack>
  );
}

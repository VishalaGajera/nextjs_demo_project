import { DatePicker, PadBox } from "@codezee/sixtify-brahma";
import { Box, Stack, useTheme } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useSearchParams } from "next/navigation";
import { type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { employeeBasicDetailsKeys } from "../../../../../../queryKeysFactories/employee";
import { Debounce_Delay } from "../../../../../../utils/helper";
import { AddAttendanceActionButton } from "../../../../../AttendanceDetails/AddAttendanceActionButton/AddAttendanceActionButton";
import { AttendanceDetailsView } from "../../../../../AttendanceDetails/AttendanceDetailsView/AttendanceDetailsView";
import { AttendanceSummaryTab } from "../../../../../AttendanceDetails/AttendanceSummary/AttendanceSummaryTabs/AttendanceSummaryTabs";
import { EmployeeSummaryCards } from "../../../../../AttendanceDetails/AttendanceSummary/AttendanceSummaryTabs/EmployeeSummaryCards/EmployeeSummaryCards";
import type { OptionKey } from "../../../../../AttendanceDetails/AttendanceSummary/AttendanceSummaryTabs/hooks/useTabOptions";
import { useGetAttendanceDetails } from "../../../../../AttendanceDetails/AttendanceSummary/hooks/useGetAttendanceDetails";
import type { EmployeeBasicDetails } from "../../EmployeeBasicDetails/hooks/useGetEmployeeBasicDetails";

type EmployeeAttendanceArgs = Readonly<{
  employeeId: string;
}>;

export const EmployeeAttendance = ({ employeeId }: EmployeeAttendanceArgs) => {
  const { control, watch } = useForm({
    defaultValues: {
      datePeriod: DateTime.now().toFormat("yyyy-MM"),
    },
  });

  const [date] = useDebounceValue(
    DateTime.fromISO(watch("datePeriod")).toFormat("yyyy-MM"),
    Debounce_Delay
  );

  const currentDate = DateTime.now().toISODate();

  const { data, isFetching } = useGetAttendanceDetails({
    employeeId,
    date,
    currentDate,
  });

  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  const searchParams = useSearchParams();

  const tab = searchParams.get("type");

  const categoryRenderer: Record<OptionKey, ReactNode> = {
    day: (
      <EmployeeSummaryCards
        cardData={data?.summary?.day}
        type="Days"
        isLoading={isFetching}
      />
    ),
    hours: (
      <EmployeeSummaryCards
        cardData={data?.summary?.hours}
        type="Hours"
        isLoading={isFetching}
      />
    ),
  };

  const queryClient = useQueryClient();

  const cachedData = queryClient.getQueryData<EmployeeBasicDetails>(
    employeeBasicDetailsKeys.get(employeeId)
  );

  const joiningData = cachedData?.joining_date ? cachedData.joining_date : "";

  return (
    <Stack gap="20px">
      <Box bgcolor={lightBlue[50]} sx={{ borderRadius: "5px" }}>
        <PadBox padding={{ padding: 1 }}>
          <Stack
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <AttendanceSummaryTab employeeId={employeeId} />

            <Stack flexDirection="row" gap="10px" alignItems="center">
              <DatePicker
                clearable={false}
                format="MMM yyyy"
                views={["year", "month"]}
                name="datePeriod"
                maxDate={DateTime.now()}
                minDate={DateTime.fromISO(joiningData)}
                disableKeyboardInput
                control={control}
                sx={{ maxWidth: "200px" }}
              />

              <AddAttendanceActionButton
                employeeId={employeeId}
                date={date}
                joiningData={joiningData}
              />
            </Stack>
          </Stack>

          {tab && categoryRenderer[tab as OptionKey]}
        </PadBox>
      </Box>

      <AttendanceDetailsView
        employeeId={employeeId}
        attendanceDetails={data}
        isLoading={isFetching}
        date={date}
        stickValue={650}
      />
    </Stack>
  );
};

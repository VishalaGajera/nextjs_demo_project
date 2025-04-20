"use client";

import { DatePicker, PadBox } from "@codezee/sixtify-brahma";
import {
  Avatar,
  Box,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { DateTime } from "luxon";
import type { Control } from "react-hook-form";
import { useGetEmployeeBasicDetails } from "../../EmployeeManagement/Employee/EmployeeDetails/EmployeeBasicDetails/hooks/useGetEmployeeBasicDetails";
import { AddAttendanceActionButton } from "../AddAttendanceActionButton/AddAttendanceActionButton";

type AttendanceDetailsHeaderArgs = {
  control: Control<{ datePeriod: string }>;
  employeeId: string;
  date: string;
};

export function AttendanceDetailsHeader({
  control,
  employeeId,
  date,
}: Readonly<AttendanceDetailsHeaderArgs>) {
  const theme = useTheme();

  const { iron, lightBlue } = theme.palette.app.color;

  const { data: employeeData, isFetching } = useGetEmployeeBasicDetails({
    employeeId,
  });

  if (!employeeData || isFetching) {
    return (
      <Box bgcolor={lightBlue[50]} sx={{ borderRadius: "5px" }}>
        <PadBox padding={{ padding: 1 }}>
          <Stack flexDirection="row" gap="15px" alignItems="center">
            <Skeleton
              variant="circular"
              height={50}
              animation="wave"
              width="50px"
            />
            <Stack gap="5px">
              <Skeleton
                variant="rounded"
                height={20}
                animation="wave"
                width="90px"
              />
              <Skeleton
                variant="rounded"
                height={20}
                animation="wave"
                width="150px"
              />
            </Stack>
          </Stack>
        </PadBox>
      </Box>
    );
  }

  return (
    <Box bgcolor={lightBlue[50]} sx={{ borderRadius: "5px" }}>
      <PadBox padding={{ padding: 1 }}>
        <Stack flexDirection="row" justifyContent="space-between">
          <Stack flexDirection="row" gap="15px" alignItems="center">
            <Avatar
              sx={{ height: "50px", width: "50px" }}
              src={employeeData.avatar}
            />

            <Box>
              <Typography variant="subtitle1" fontWeight={500}>
                {employeeData.employee_name}
              </Typography>

              <Typography variant="subtitle2" color={iron[500]}>
                {employeeData.designation_name}
              </Typography>
            </Box>
          </Stack>

          <Stack flexDirection="row" gap="15px" alignItems="center">
            <DatePicker
              clearable={false}
              format="MMM yyyy"
              views={["year", "month"]}
              name="datePeriod"
              maxDate={DateTime.now()}
              minDate={DateTime.fromISO(employeeData.joining_date ?? "")}
              disableKeyboardInput
              control={control}
              sx={{ maxWidth: "200px" }}
            />

            <AddAttendanceActionButton
              employeeId={employeeId}
              date={date}
              joiningData={employeeData.joining_date ?? ""}
            />
          </Stack>
        </Stack>
      </PadBox>
    </Box>
  );
}

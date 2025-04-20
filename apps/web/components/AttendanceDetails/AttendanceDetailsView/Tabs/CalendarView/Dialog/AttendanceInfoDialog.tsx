import {
  Dialog,
  getTimeInHHmm,
  PadBox,
  PieChart,
  StepperV3,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { useGetAttendanceLogs } from "../../../../../Transactions/Attendance/AttendanceOverview/Dialogs/hooks/useGetAttendanceLogs";
import type { AttendanceRecord } from "../../../../AttendanceSummary/hooks/type";
import { AttendanceShiftInfoCard } from "./AttendanceShiftInfoCard";

type AttendanceInfoDialogProps = {
  open: boolean;
  onClose: () => void;
  attendanceRecords: AttendanceRecord[];
  day: number;
  employeeId: string;
};

export const AttendanceInfoDialog = ({
  open,
  onClose,
  attendanceRecords,
  day,
  employeeId,
}: AttendanceInfoDialogProps) => {
  const theme = useTheme();

  const { butterflyBlue, slate } = theme.palette.app.color;

  const date = attendanceRecords[day]?.date ?? "";

  const { data } = useGetAttendanceLogs({
    selectedEmployeeId: employeeId,
    date,
  });

  const workHours = parseInt(
    getTimeInHHmm(attendanceRecords[day]?.work_hours ?? "00:00", "HH:mm"),
    10
  );

  const shiftHours = parseInt(
    getTimeInHHmm(attendanceRecords[day]?.shift_hours ?? "00:00", "HH:mm"),
    10
  );

  const workHoursPercentage = (workHours / shiftHours) * 100;

  const remainingPercentage = 100 - workHoursPercentage;

  const series = {
    cornerRadius: 0,
    data: [
      {
        value: workHoursPercentage,
        color: butterflyBlue[900],
      },
      {
        value: remainingPercentage,
        color: butterflyBlue[700],
      },
    ],
    innerRadius: 50,
    outerRadius: 80,
  };

  const steps = useMemo(() => {
    const logs = attendanceRecords[day]?.attendance_logs?.logs ?? [];

    const combinedTimes = logs.flatMap(({ in_time, out_time }) => [
      {
        in_time: in_time ? getTimeInHHmm(in_time, "HH:mm") : "-",
      },
      { out_time: out_time ? getTimeInHHmm(out_time, "HH:mm") : "-" },
    ]);

    return combinedTimes;
  }, []);

  const filteredSteps = steps.filter((log) =>
    Object.values(log).every((value) => value && value !== "-")
  );

  return (
    <Dialog maxWidth="sm" onClose={onClose} open={open} title="Attendance Info">
      <Stack direction="row" gap="10px" justifyContent="center">
        <Box sx={{ border: `1px solid ${slate[800]}` }}>
          <PadBox padding={{ padding: "15px" }}>
            <Stack
              direction="column"
              gap="10px"
              justifyContent="center"
              justifyItems="center"
              alignItems="center"
            >
              <Stack gap="5px" justifyContent="center">
                {attendanceRecords[day]?.date && (
                  <>
                    <Typography variant="h6">
                      {DateTime.fromISO(attendanceRecords[day]?.date).toFormat(
                        "dd LLL yyyy"
                      )}
                      ,
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ textAlign: "center" }}
                    >{` (${DateTime.fromISO(attendanceRecords[day].date).toFormat("cccc")})`}</Typography>
                  </>
                )}
              </Stack>
              <PieChart
                height={235}
                series={series}
                tooltip={{ trigger: "none" }}
                label={getTimeInHHmm(
                  attendanceRecords[day]?.work_hours ?? "00:00",
                  "HH:mm"
                )}
              />
              <AttendanceShiftInfoCard
                data={data}
                attendanceRecords={attendanceRecords}
                day={day}
              />
            </Stack>
          </PadBox>
        </Box>
        <Box
          sx={{
            border: `1px solid ${slate[800]}`,
          }}
        >
          <PadBox padding={{ padding: "15px" }}>
            <Stack direction="column" gap="10px" justifyContent="center">
              <Typography variant="h6">In/Out Attendance Logs</Typography>

              <StepperV3
                orientation="vertical"
                sx={{ maxHeight: "350px", overflowY: "auto" }}
                activeStep={filteredSteps.length}
                steps={steps}
              />
            </Stack>
          </PadBox>
        </Box>
      </Stack>
    </Dialog>
  );
};

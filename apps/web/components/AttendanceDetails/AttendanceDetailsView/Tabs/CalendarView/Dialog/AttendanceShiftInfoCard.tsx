import { getTimeInHHmm, PadBox } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { getShiftTime } from "../../../../../../utils/date";
import { getLabelColor } from "../../../../../Transactions/Attendance/AttendanceOverview/Dialogs/AttendanceFormShiftDetailsCard";
import type { AttendanceLogs } from "../../../../../Transactions/Attendance/AttendanceOverview/Dialogs/hooks/type";
import type { AttendanceRecord } from "../../../../AttendanceSummary/hooks/type";

type AttendanceShiftInfoCardProps = {
  data: AttendanceLogs;
  attendanceRecords: AttendanceRecord[];
  day: number;
};

export const AttendanceShiftInfoCard = ({
  data,
  attendanceRecords,
  day,
}: AttendanceShiftInfoCardProps) => {
  const theme = useTheme();

  const { lipstickRed } = theme.palette.app.color;

  if (!attendanceRecords[day]) {
    return;
  }

  const logs = attendanceRecords[day].attendance_logs?.logs;

  const lastOutTimeLog = logs?.[logs.length - 1]?.out_time;

  return (
    <Box
      width="250px"
      sx={{
        border: `1px solid ${getLabelColor(data.status, "dark").color}`,
        borderRadius: "8px",
        backgroundColor: `${getLabelColor(data.status, "light").color}}`,
      }}
    >
      {data.status && (
        <Box sx={{ display: "flex", justifyContent: "end", padding: "5px" }}>
          <Box
            sx={{
              border: `1px solid ${getLabelColor(data.status, "dark").color}`,
              backgroundColor: "white",
              borderRadius: "5px",
              height: "min-content",
              padding: "0px 5px",
              width: "fit-content",
            }}
          >
            <Typography variant="body2">
              {getLabelColor(data.status).label}
            </Typography>
          </Box>
        </Box>
      )}

      <PadBox padding={{ padding: "10px" }}>
        <Stack gap="10px">
          <Stack gap="5px" direction="row">
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Shift Time :
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: 400 }}>
              {attendanceRecords[day].shift_start &&
              attendanceRecords[day].shift_end
                ? getShiftTime(
                    attendanceRecords[day].shift_start,
                    attendanceRecords[day].shift_end
                  )
                : "-"}
            </Typography>
          </Stack>

          <Stack gap="5px" direction="row">
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Shift Hours :
            </Typography>

            <Typography variant="body2">
              {attendanceRecords[day].shift_hours
                ? getTimeInHHmm(attendanceRecords[day].shift_hours)
                : "-"}
            </Typography>
          </Stack>

          <Stack gap="5px" direction="row">
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Break Hours :
            </Typography>

            <Typography variant="body2">
              {attendanceRecords[day].break_hours
                ? getTimeInHHmm(attendanceRecords[day].break_hours)
                : "-"}
            </Typography>
          </Stack>

          <Stack direction="row" gap="5px" alignItems="center">
            <Stack direction="row" gap="5px">
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                First In :
              </Typography>

              <Typography variant="body2" sx={{ fontWeight: 400 }}>
                {logs?.[0]?.in_time
                  ? getTimeInHHmm(logs[0].in_time, "HH:mm")
                  : "-"}
              </Typography>
            </Stack>

            {attendanceRecords[day].attendance_logs?.late_by && (
              <Typography variant="caption" color={lipstickRed[800]}>
                (Late:
                {getTimeInHHmm(attendanceRecords[day].attendance_logs.late_by)})
              </Typography>
            )}
          </Stack>

          <Stack direction="row" gap="5px" alignItems="center">
            <Stack direction="row" gap="5px">
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Last Out :
              </Typography>

              <Typography variant="body2" sx={{ fontWeight: 400 }}>
                {lastOutTimeLog ? getTimeInHHmm(lastOutTimeLog, "HH:mm") : "-"}
              </Typography>
            </Stack>

            {attendanceRecords[day].attendance_logs?.early_by && (
              <Typography variant="caption" color={lipstickRed[800]}>
                (Early:
                {getTimeInHHmm(attendanceRecords[day].attendance_logs.early_by)}
                )
              </Typography>
            )}
          </Stack>
        </Stack>
      </PadBox>
    </Box>
  );
};

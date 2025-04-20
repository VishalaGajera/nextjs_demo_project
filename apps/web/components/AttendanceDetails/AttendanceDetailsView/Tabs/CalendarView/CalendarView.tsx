import {
  PadBox,
  SeverityIndicator,
  getColorByVariant,
  getStatusLabel,
  getTimeInHHmm,
} from "@codezee/sixtify-brahma";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { DateTime, Info } from "luxon";
import { useState } from "react";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { getShiftTime } from "../../../../../utils/date";
import { getShiftTypeLabel } from "../../../../common/Autocomplete/ShiftSchemeAutocomplete";
import type { AttendanceRecord } from "../../../AttendanceSummary/hooks/type";
import { AttendanceInfoDialog } from "./Dialog/AttendanceInfoDialog";
import { Skeleton } from "./Skeleton";

type CalendarViewProps = {
  year: number;
  month: number;
  attendanceRecords: AttendanceRecord[];
  isLoading?: boolean;
  employeeId: string;
  joiningData: string;
};

export const CalendarView = ({
  year = 2024,
  month = 12,
  attendanceRecords,
  isLoading,
  employeeId,
  joiningData,
}: CalendarViewProps) => {
  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const [currentDay, setCurrentDay] = useState(-1);

  const getFirstDayColumn = (year: number, month: number): number => {
    const firstDay = DateTime.local(year, month, 1).weekday;

    return firstDay - 1;
  };

  const getDaysInMonth = (year: number, month: number): number => {
    const daysInMonth = DateTime.local(year, month, 1).daysInMonth ?? 30;

    return daysInMonth;
  };

  const getLastDaysOfPreviousMonth = (
    year: number,
    month: number
  ): number[] => {
    const prevMonth = DateTime.local(year, month, 1).minus({ months: 1 });

    const lastDayOfPrevMonth = prevMonth.daysInMonth ?? 30;

    return Array.from(
      { length: getFirstDayColumn(year, month) },
      (_, index) =>
        lastDayOfPrevMonth - (getFirstDayColumn(year, month) - 1) + index
    );
  };

  const theme = useTheme();

  const { slate, iron, lipstickRed, darkOrange } = theme.palette.app.color;

  const daysOfWeek = Info.weekdays("short").map((day) => day.toUpperCase());

  const dialogRenderer: DialogRenderer = {
    view: attendanceRecords && (
      <AttendanceInfoDialog
        open
        onClose={onDialogClose}
        day={currentDay}
        attendanceRecords={attendanceRecords}
        employeeId={employeeId}
      />
    ),
  };

  return (
    <Stack>
      <Stack direction="row" justifyContent="center">
        {daysOfWeek.map((day) => (
          <Box
            key={day}
            sx={{
              flex: 1,
              textAlign: "center",
              fontWeight: 500,
              paddingY: "5px",
              borderRight: `1px solid ${slate[800]}`,
              borderLeft: `2px solid ${slate[800]}`,
            }}
          >
            {day}
          </Box>
        ))}
      </Stack>

      {isLoading ? (
        <Skeleton />
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "1px",
            border: `1px solid ${slate[800]}`,
            backgroundColor: `${slate[800]}`,
          }}
        >
          {getLastDaysOfPreviousMonth(year, month).map((day, index) => (
            <Box
              key={`prev-${day}-${index}`}
              sx={{
                backgroundColor: `${iron[600]}`,
                border: `1px solid ${slate[800]}`,
                height: "192px",
              }}
            >
              <PadBox padding={{ paddingLeft: "10px", paddingTop: "10px" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 500,
                    color: `${slate[500]}`,
                  }}
                >
                  {day}
                </Typography>
              </PadBox>
            </Box>
          ))}

          {attendanceRecords.map((item, index) => {
            const missingPunch = item.attendance_logs?.logs.some(
              // eslint-disable-next-line sonarjs/different-types-comparison
              (log) => log.in_time === null || log.out_time === null
            );

            if (item.date < joiningData) {
              return (
                <Box
                  key={item.date}
                  sx={{
                    backgroundColor: `${iron[600]}`,
                    border: `1px solid ${slate[800]}`,
                    height: "192px",
                  }}
                >
                  <PadBox padding={{ paddingLeft: "10px", paddingTop: "10px" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 500,
                        color: `${slate[500]}`,
                      }}
                    >
                      {index + 1}
                    </Typography>
                  </PadBox>
                </Box>
              );
            }

            return (
              <Stack
                key={item.date}
                sx={{
                  backgroundColor: `${iron[600]}`,
                  cursor: "pointer",
                  height: "192px",
                  border: `1px solid ${slate[800]}`,
                }}
                justifyContent="space-between"
                onClick={() => {
                  setCurrentDay(index);
                  onDialogOpen("view");
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  padding="10px"
                >
                  <Typography variant="h6">
                    {DateTime.fromISO(item.date).toFormat("dd")}
                  </Typography>

                  <Stack direction="column" spacing={1}>
                    <Typography
                      variant="body1"
                      sx={{
                        alignSelf: "flex-end",
                        color: `${slate[500]}`,
                        fontWeight: 500,
                      }}
                    >
                      {item.shift_type_name ?? "-"} (
                      {getShiftTypeLabel(item.shift_type) ?? ""})
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: `${slate[500]}`,
                        fontWeight: 500,
                      }}
                    >
                      {item.shift_start && item.shift_end
                        ? getShiftTime(item.shift_start, item.shift_end)
                        : "-"}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack
                  padding="10px"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="flex-end"
                >
                  <Stack gap="5px">
                    {item.attendance_logs?.early_by && (
                      <Typography variant="caption" color={lipstickRed[800]}>
                        Early by: {getTimeInHHmm(item.attendance_logs.early_by)}
                      </Typography>
                    )}

                    {item.attendance_logs?.late_by && (
                      <Typography variant="caption" color={lipstickRed[800]}>
                        Late by: {getTimeInHHmm(item.attendance_logs.late_by)}
                      </Typography>
                    )}

                    {item.attendance_status.map((status) => {
                      const color = getColorByVariant(status) ?? "";

                      const label = getStatusLabel(status);

                      return (
                        <SeverityIndicator
                          key={status}
                          label={label}
                          color={color}
                          isBackground={true}
                        />
                      );
                    })}
                  </Stack>

                  {missingPunch && (
                    <Tooltip title="Missing Log" arrow placement="top">
                      <InfoOutlinedIcon
                        sx={{
                          color: darkOrange[800],
                        }}
                      />
                    </Tooltip>
                  )}
                </Stack>
              </Stack>
            );
          })}

          {Array.from(
            {
              length:
                42 -
                (getDaysInMonth(year, month) +
                  getLastDaysOfPreviousMonth(year, month).length),
            },
            (_, index) => (
              <Box
                key={`next-${index}`}
                sx={{
                  backgroundColor: `${iron[600]}`,
                  border: `1px solid ${slate[800]}`,
                  height: "192px",
                }}
              >
                <PadBox padding={{ paddingLeft: "10px", paddingTop: "10px" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: `${slate[500]}`,
                    }}
                  >
                    {index + 1}
                  </Typography>
                </PadBox>
              </Box>
            )
          )}
        </Box>
      )}

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
};

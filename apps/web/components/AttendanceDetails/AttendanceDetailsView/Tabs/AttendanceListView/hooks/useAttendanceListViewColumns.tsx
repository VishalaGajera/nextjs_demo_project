import {
  ActionCell,
  AttendanceStatus,
  ChipWithBorder,
  LoadingCell,
  Timeline,
  getColorByVariant,
  getStatusLabel,
  getTimeInHHmm,
  serverityOptions,
  type WorkDayType,
} from "@codezee/sixtify-brahma";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../utils/date";
import { getShiftTypeLabel } from "../../../../../common/Autocomplete/ShiftSchemeAutocomplete";
import type { AttendanceRecord } from "../../../../AttendanceSummary/hooks/type";

type UseAttendanceListViewColumns = {
  loading: boolean;
  onAction: (actionType: DialogTypes, rowData: AttendanceRecord) => void;
};

export const useAttendanceListViewColumns = ({
  loading,
  onAction,
}: AgColumnsArgs<UseAttendanceListViewColumns>) => {
  const theme = useTheme();

  const { lipstickRed, darkOrange } = theme.palette.app.color;

  const columns: AgColumnsWithActions<AttendanceRecord> = [
    {
      headerName: "Date",
      field: "date",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        const dateTime = DateTime.fromISO(value);

        if (!dateTime.isValid) {
          return;
        }

        return (
          <Stack gap="2px" justifyContent="center">
            <Typography variant="body2">
              {dateFormat(value, true) ?? "-"},
            </Typography>
            <Typography variant="body2">{` (${DateTime.fromISO(value).toFormat("cccc")})`}</Typography>
          </Stack>
        );
      },
      sortable: false,
      maxWidth: 120,
    },
    {
      headerName: "Shift",
      field: "shift_type_name",
      minWidth: 290,

      cellRenderer: ({ data }: CustomCellRendererProps<AttendanceRecord>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return "-";
        }

        return (
          <Stack gap="2px" justifyContent="center">
            <Typography variant="body2">
              {data.shift_type_name ?? "-"} (
              {getShiftTypeLabel(data.shift_type) ?? ""})
            </Typography>

            <Typography variant="body2">
              {data.shift_start && data.shift_end
                ? `${getTimeInHHmm(data.shift_start)} - ${getTimeInHHmm(data.shift_end)}`
                : "-"}
            </Typography>
          </Stack>
        );
      },
      sortable: false,
      maxWidth: 155,
    },
    {
      headerName: "Shift/Break",
      field: "shift_hours",
      minWidth: 250,

      cellRenderer: ({ data }: CustomCellRendererProps<AttendanceRecord>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return "-";
        }

        return (
          <Stack>
            <Typography variant="body2">
              {data.shift_start && data.shift_end
                ? `${getTimeInHHmm(data.shift_hours)}`
                : "-"}
            </Typography>

            <Typography variant="body2">
              {data.shift_start && data.shift_end
                ? ` ${getTimeInHHmm(data.break_hours)}`
                : "-"}
            </Typography>
          </Stack>
        );
      },
      sortable: false,
      maxWidth: 120,
    },
    {
      headerName: "Attendance Logs",
      field: "attendance_logs",
      cellRenderer: ({ data }: CustomCellRendererProps<AttendanceRecord>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        const attendanceLogs = data.attendance_logs;

        const logs = attendanceLogs?.logs || [];

        const logInTime = logs[0]?.in_time;

        const logInEntry = logInTime ? getTimeInHHmm(logInTime) : "-";

        const logOutTime = logs[logs.length - 1]?.out_time;

        const lastLogOutEntry = logOutTime ? getTimeInHHmm(logOutTime) : "-";

        const lateBy = attendanceLogs?.late_by;

        const earlyBy = attendanceLogs?.early_by;

        const missingPunch = logs.some(
          // eslint-disable-next-line sonarjs/different-types-comparison
          (log) => log.in_time === null || log.out_time === null
        );

        return (
          <Stack
            justifyContent="space-between"
            flexDirection="row"
            gap="30px"
            alignItems="center"
            flex={1}
          >
            <Stack width="110px">
              <Typography variant="body2">{logInEntry}</Typography>

              {lateBy && (
                <Typography variant="body2" color={lipstickRed[800]}>
                  Late {getTimeInHHmm(lateBy)}
                </Typography>
              )}
            </Stack>

            {!attendanceLogs ? (
              // eslint-disable-next-line sonarjs/no-nested-conditional
              data.attendance_status.length ? (
                <AttendanceStatus
                  variant={(data.attendance_status[0] ?? "") as WorkDayType}
                />
              ) : (
                <Typography width="100%" textAlign="center">
                  No Attendance Log
                </Typography>
              )
            ) : (
              <Timeline
                highlightedIntervals={attendanceLogs.logs}
                shiftEndTime={data.shift_end}
                shiftStartTime={data.shift_start}
                startTimeline={attendanceLogs.slot_start}
                totalDots={24}
              />
            )}

            <Stack
              width="140px "
              alignItems="center"
              flexDirection="row"
              gap="2px"
            >
              <Box>
                <Typography variant="body2">{lastLogOutEntry}</Typography>

                {earlyBy && (
                  <Typography variant="body2" color={lipstickRed[800]}>
                    Early {getTimeInHHmm(earlyBy)}
                  </Typography>
                )}
              </Box>

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
      },
      sortable: false,
    },
    {
      headerName: "Net Hrs ",
      field: "net_work_hours",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (value && getTimeInHHmm(value)) || "-";
      },
      sortable: false,
      maxWidth: 90,
    },
    {
      headerName: "P.I / Pen ",
      field: "penalty_work_hours",

      cellRenderer: ({ data }: CustomCellRendererProps<AttendanceRecord>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return "-";
        }

        return (
          <Stack>
            <Typography variant="body2">
              {data.personal_in_out_hours
                ? `${getTimeInHHmm(data.personal_in_out_hours)}`
                : "-"}
            </Typography>

            <Typography variant="body2">
              {data.penalty_work_hours
                ? ` ${getTimeInHHmm(data.penalty_work_hours)}`
                : "-"}
            </Typography>
          </Stack>
        );
      },
      sortable: false,
      maxWidth: 90,
    },
    {
      headerName: "OT Hrs",
      field: "overtime_work_hours",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (value && getTimeInHHmm(value)) || "-";
      },
      sortable: false,
      maxWidth: 80,
    },
    {
      headerName: "Pay Hrs",
      field: "total_pay_hours",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (value && getTimeInHHmm(value)) || "-";
      },
      sortable: false,
      maxWidth: 90,
    },
    {
      headerName: "Act/Grs",
      field: "work_hours",

      cellRenderer: ({ data }: CustomCellRendererProps<AttendanceRecord>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return "-";
        }

        return (
          <Stack>
            <Typography variant="body2">
              {data.work_hours ? `${getTimeInHHmm(data.work_hours)}` : "-"}
            </Typography>

            <Typography variant="body2">
              {data.gross_hours ? ` ${getTimeInHHmm(data.gross_hours)}` : "-"}
            </Typography>
          </Stack>
        );
      },
      sortable: false,
      maxWidth: 100,
    },
    {
      headerName: "Status",
      field: "attendance_status",
      cellRenderer: ({ data }: CustomCellRendererProps<AttendanceRecord>) => {
        if (loading) {
          return <LoadingCell />;
        }

        const handleColorLabel = (item: WorkDayType) => {
          return {
            color: getColorByVariant(item),
            label: serverityOptions[item],
          };
        };

        return (
          <Stack
            flexDirection="row"
            gap="2px"
            sx={{
              width: "100%",
              justifyContent: "center",
            }}
          >
            {data?.attendance_status.length ? (
              <>
                {data.attendance_status.map((item) => {
                  const toolTipLabel = getStatusLabel(item);

                  return (
                    <ChipWithBorder
                      key={uuidv4()}
                      color={handleColorLabel(item).color}
                      label={handleColorLabel(item).label}
                      toolTipLabel={toolTipLabel}
                    />
                  );
                })}
              </>
            ) : (
              "-"
            )}
          </Stack>
        );
      },
      sortable: false,
      maxWidth: 80,
    },
    {
      headerName: "",
      field: "action",
      sortable: false,
      pinned: "right",
      lockPinned: true,
      maxWidth: 70,
      cellRenderer: ({ data }: CustomCellRendererProps<AttendanceRecord>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        const items = [
          { title: "Add Logs", onClick: () => onAction("add", data) },
        ];

        return <ActionCell items={items}></ActionCell>;
      },
    },
  ];

  return { columns };
};

import {
  ActionCell,
  Chip,
  LoadingCell,
  Tooltip,
} from "@codezee/sixtify-brahma";
import { ErrorOutlineOutlined } from "@mui/icons-material";
import { alpha, Stack, Typography, useTheme } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { capitalize } from "lodash";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../../../utils/date";
import { getColorByVariant } from "../../../LeaveBalance/colorVariant";
import { getLeaveDays } from "../../../PendingLeaveRequests/Dialogs/ActionDialogs/LeaveDetailsSection";
import type { LeaveRequestData } from "../../../PendingLeaveRequests/PendingLeaveRequestsList/hooks/useGetPendingLeaveRequests";
import { calculateLeaveHalf } from "../../../PendingLeaveRequests/PendingLeaveRequestsList/hooks/usePendingLeaveRequestsColumns";

type UseLeaveHistoryColumns = {
  loading: boolean;
  onAction: (actionType: DialogTypes, rowData: LeaveRequestData) => void;
};

export const useLeaveHistoryColumns = ({
  onAction,
  loading,
}: AgColumnsArgs<UseLeaveHistoryColumns>) => {
  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const columns: AgColumnsWithActions<LeaveRequestData> = [
    {
      sortable: false,
      headerName: "Leave Date/Days",
      field: "from_date",
      cellRenderer: ({ data }: CustomCellRendererProps<LeaveRequestData>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Stack flex={1} direction="row" justifyContent="space-between">
            <Stack>
              <Typography variant="body2">
                {data.from_date &&
                  data.to_date &&
                  getLeaveDays(data.from_date, data.to_date)}
              </Typography>
              <Typography
                color={butterflyBlue[400]}
                fontWeight={400}
                variant="body2"
              >
                {data.total_leaves} Days
                {data.from_date &&
                  data.to_date &&
                  ` ${calculateLeaveHalf(data.from_date, data.to_date, data.from_half, data.to_half)}`}
              </Typography>
            </Stack>

            {!!data.is_sandwich_leave && (
              <ErrorOutlineOutlined color="warning" />
            )}
          </Stack>
        );
      },
    },
    {
      maxWidth: 120,
      headerName: "Leave Type",
      field: "leave_type",
      sortable: false,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Typography variant="body2">
            {value ? capitalize(value) : "-"}
          </Typography>
        );
      },
    },
    {
      maxWidth: 140,
      headerName: "Leave Name",
      field: "leave_type_name",
      sortable: false,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value;
      },
    },
    {
      headerName: "Request By",
      field: "applied_by",
      sortable: false,
      cellRenderer: ({ data }: CustomCellRendererProps<LeaveRequestData>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Stack>
            <Typography variant="body2">{data.applied_by}</Typography>

            <Typography
              color={butterflyBlue[400]}
              fontWeight={400}
              variant="body2"
            >
              {data.applied_at ? dateFormat(data.applied_at) : "-"}
            </Typography>
          </Stack>
        );
      },
    },
    {
      headerName: "Leave Remark",
      field: "reason",
      sortable: false,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Tooltip toolTipLabel={value}>
            <Typography variant="body2" color={butterflyBlue[400]}>
              {value ?? "-"}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      maxWidth: 150,
      headerName: "Status",
      field: "status",
      sortable: false,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Stack>
            {value ? (
              <Chip
                label={value ? capitalize(value) : "-"}
                sx={{
                  width: "fit-content",
                  color: getColorByVariant(value),
                  backgroundColor: alpha(
                    getColorByVariant(value) ?? "transparent",
                    0.2
                  ),
                }}
              />
            ) : (
              "-"
            )}
          </Stack>
        );
      },
    },
    {
      headerName: "Action By",
      field: "last_action_by",
      sortable: false,
      cellRenderer: ({ data }: CustomCellRendererProps<LeaveRequestData>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Stack>
            <Typography variant="body2">
              {data.last_action_type === "manual"
                ? data.last_action_by
                : "System Approved"}
            </Typography>

            <Typography
              color={butterflyBlue[400]}
              fontWeight={400}
              variant="body2"
            >
              {data.last_action_at && dateFormat(data.last_action_at)}
            </Typography>
          </Stack>
        );
      },
    },
    {
      headerName: "Remark",
      field: "last_action_remark",
      sortable: false,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Tooltip toolTipLabel={value}>
            <Typography variant="body2" color={butterflyBlue[400]}>
              {value}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      headerName: "",
      field: "action",
      pinned: "right",
      sortable: false,
      maxWidth: 100,
      cellRenderer: ({ data }: CustomCellRendererProps<LeaveRequestData>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        const items = [
          { title: "View", onClick: () => onAction("view", data) },
          ...(data.status !== "cancelled" && data.status !== "rejected"
            ? [{ title: "Cancel", onClick: () => onAction("cancel", data) }]
            : []),
        ];

        return <ActionCell items={items}></ActionCell>;
      },
    },
  ];

  return { columns };
};

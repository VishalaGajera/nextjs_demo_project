import {
  ActionCell,
  Chip,
  LoadingCell,
  Tooltip,
} from "@codezee/sixtify-brahma";
import {
  CancelOutlined,
  CheckCircleOutlineOutlined,
  ErrorOutlineOutlined,
} from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { capitalize, isEqual } from "lodash";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../../../utils/date";
import { getLeaveDays } from "../../Dialogs/ActionDialogs/LeaveDetailsSection";
import type { LeaveRequestData } from "./useGetPendingLeaveRequests";

type UsePendingLeaveRequestsColumns = {
  loading: boolean;
  onAction: (actionType: DialogTypes, rowData: LeaveRequestData) => void;
};

export const calculateLeaveHalf = (
  from_date: string,
  to_date: string,
  from_half: string | null,
  to_half: string | null
): string => {
  if (isEqual(from_date, to_date)) {
    if (from_half === "first_half" && to_half === "first_half") {
      return " (First half)";
    }

    if (from_half === "second_half" && to_half === "second_half") {
      return " (Second half)";
    }
  }

  return "";
};

export const usePendingLeaveRequestsColumns = ({
  onAction,
  loading,
}: AgColumnsArgs<UsePendingLeaveRequestsColumns>) => {
  const theme = useTheme();

  const { butterflyBlue, darkOrange } = theme.palette.app.color;

  const columns: AgColumnsWithActions<LeaveRequestData> = [
    {
      minWidth: 200,
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
      maxWidth: 150,
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
      maxWidth: 200,
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
      minWidth: 175,
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
                label={capitalize(value)}
                sx={{
                  width: "fit-content",
                  color: darkOrange[900],
                  backgroundColor: darkOrange[600],
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
      headerName: "Last Action By/Date",
      field: "last_action_by",
      sortable: true,
      cellRenderer: ({ data }: CustomCellRendererProps<LeaveRequestData>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Box>
            {data.last_action_by && data.last_action_at ? (
              <Stack>
                <Typography variant="body2">{data.last_action_by}</Typography>

                <Typography
                  color={butterflyBlue[400]}
                  fontWeight={400}
                  variant="body2"
                >
                  {dateFormat(data.last_action_at)}
                </Typography>
              </Stack>
            ) : (
              "-"
            )}
          </Box>
        );
      },
    },
    {
      headerName: "Next Approvers",
      field: "next_approvers",
      sortable: true,
      cellRenderer: ({ value }: CustomCellRendererProps<LeaveRequestData>) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Tooltip toolTipLabel={value?.join(", ")}>
            <Typography variant="body2">
              {value ? value.join(", ") : "-"}
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
      maxWidth: 150,
      cellStyle: { justifyContent: "center" },
      cellRenderer: ({ data }: CustomCellRendererProps<LeaveRequestData>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        const items = [
          { title: "Edit", onClick: () => onAction("edit", data) },
          { title: "View", onClick: () => onAction("view", data) },
          { title: "Cancel", onClick: () => onAction("cancel", data) },
        ];

        return (
          <Stack direction="row" gap="10px" alignItems="center">
            <CheckCircleOutlineOutlined
              fontSize="medium"
              color="success"
              style={{ cursor: "pointer" }}
              onClick={() => onAction("approve", data)}
            />

            <CancelOutlined
              fontSize="medium"
              color="error"
              style={{ cursor: "pointer" }}
              onClick={() => onAction("reject", data)}
            />

            <ActionCell items={items} />
          </Stack>
        );
      },
    },
  ];

  return { columns };
};

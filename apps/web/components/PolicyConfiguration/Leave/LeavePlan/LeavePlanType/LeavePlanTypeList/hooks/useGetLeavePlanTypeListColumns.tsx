import {
  ActionCell,
  ConfigureAction,
  Indicator,
  LoadingCell,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { capitalize } from "lodash";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../types/dialogs";
import { useGetLeaveBalanceAdjustmentOptions } from "../../../../../../common/Autocomplete/hooks/useGetLeaveBalanceAdjustmentOptions";

export type LeaveTypeList = {
  id: string;
  leave_type_name: string;
  yearly_quota: number;
  is_setup_completed: boolean;
  is_system_generated: boolean;
  colour_code: string;
  leave_type: string;
  year_end_processing_type: string;
};

type UseGetLeavePlanTypeListColumnsArgs = {
  loading: boolean;
  onAction: (actionType: DialogTypes, rowData: LeaveTypeList) => void;
};

export const useGetLeavePlanTypeListColumns = ({
  loading,
  onAction,
}: AgColumnsArgs<UseGetLeavePlanTypeListColumnsArgs>) => {
  const theme = useTheme();

  const { lipstickRed } = theme.palette.app.color;

  const column: AgColumnsWithActions<LeaveTypeList> = [
    {
      headerName: "Leave Name",
      field: "leave_type_name",
      cellRenderer: ({ data }: CustomCellRendererProps<LeaveTypeList>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        return (
          <Stack direction="row" alignItems="center" gap="10px">
            <Indicator colourCode={data?.colour_code} />

            {capitalize(data.leave_type_name)}
          </Stack>
        );
      },
      sortable: false,
    },
    {
      headerName: "Leave Type",
      field: "leave_type",

      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return capitalize(value) ?? "-";
      },
      sortable: false,
    },
    {
      headerName: "Leave Yearly Quota",
      field: "yearly_quota",
      cellRenderer: ({ data }: CustomCellRendererProps<LeaveTypeList>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        return (
          <Box>
            {data.is_setup_completed ? (
              (data.yearly_quota ?? "-")
            ) : (
              <Typography color={lipstickRed[800]}>Not Configured</Typography>
            )}
          </Box>
        );
      },
      sortable: false,
    },
    {
      headerName: "Leave Year ending Process",
      field: "year_end_processing_type",

      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        const { leaveBalanceAdjustmentOptions } =
          useGetLeaveBalanceAdjustmentOptions();

        const filteredLabel = leaveBalanceAdjustmentOptions.find(
          (item) => item.value === value
        )?.label;

        return capitalize(filteredLabel) ?? "-";
      },
      sortable: false,
    },
    {
      headerName: "",
      field: "action",
      sortable: false,
      pinned: "right",
      maxWidth: 90,
      lockPinned: true,
      cellRenderer: ({ data }: CustomCellRendererProps<LeaveTypeList>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        // TODO: Add onClick handlers in upcoming PR
        const items: { title: string; onClick: () => void }[] =
          data.is_setup_completed
            ? [
                { title: "View", onClick: () => onAction("view", data) },
                { title: "Edit", onClick: () => onAction("edit", data) },
                !data.is_system_generated
                  ? { title: "Delete", onClick: () => onAction("delete", data) }
                  : null,
              ].filter((item): item is { title: string; onClick: () => void } =>
                Boolean(item)
              )
            : [{ title: "Delete", onClick: () => onAction("delete", data) }];

        return (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            width="100%"
          >
            {!data.is_setup_completed && (
              <ConfigureAction
                sx={{ width: "39px" }}
                onClick={() => onAction("configureLeave", data)}
              />
            )}

            <Box width="20px">
              <ActionCell items={items}></ActionCell>
            </Box>
          </Stack>
        );
      },
    },
  ];

  return { column };
};

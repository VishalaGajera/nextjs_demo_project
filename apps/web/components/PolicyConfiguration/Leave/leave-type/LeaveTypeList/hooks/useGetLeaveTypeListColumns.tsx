import { ActionCell, Indicator, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { capitalize } from "lodash";
import type { AgColumnsWithActions } from "../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../types/dialogs";
import { CustomEnumFilter } from "../../../../../../utils/ag-grid-custom-filter";
import { dateFormat } from "../../../../../../utils/date";
import type { LeaveType } from "./useGetLeaveTypesList";

type UseLeaveTypeListColumns = {
  loading: boolean;
  onAction: (actionType: DialogTypes, rowData: LeaveType) => void;
};

export const useLeaveTypeListColumns = ({
  onAction,
  loading,
}: UseLeaveTypeListColumns) => {
  const columns: AgColumnsWithActions<LeaveType> = [
    {
      minWidth: 200,
      headerName: "Company Name",
      field: "company_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <span>{value ? value : "-"}</span>;
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "Leave Code",
      field: "leave_type_code",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <span>{value ? value : "-"}</span>;
      },
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      minWidth: 200,
      headerName: "Leave Name",
      field: "leave_type_name",
      cellRenderer: ({ data }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Stack direction="row" gap="10px">
            <Indicator colourCode={data?.colour_code} />

            <Typography variant="body2">{data?.leave_type_name}</Typography>
          </Stack>
        );
      },
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      minWidth: 200,
      headerName: "Leave Type",
      field: "leave_type",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <span>{value ? capitalize(value) : "-"}</span>;
      },
      sortable: true,
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: [
          { label: "Paid", value: "paid" },
          { label: "Unpaid", value: "unpaid" },
        ],
      },
    },
    {
      minWidth: 200,
      headerName: "Action By",
      field: "action_by",
      cellRenderer: ({ data }: CustomCellRendererProps<LeaveType>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Stack>
            <Typography variant="body2">{data?.action_by}</Typography>

            <Typography variant="body2">
              {dateFormat(data?.action_at)}
            </Typography>
          </Stack>
        );
      },
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "",
      field: "action",
      sortable: false,
      pinned: "right",
      maxWidth: 100,
      cellRenderer: ({ data }: CustomCellRendererProps<LeaveType>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        const items = [
          { title: "View", onClick: () => onAction("view", data) },
          { title: "Edit", onClick: () => onAction("edit", data) },
          { title: "Delete", onClick: () => onAction("delete", data) },
        ];

        return <ActionCell items={items}></ActionCell>;
      },
    },
  ];

  return { columns };
};

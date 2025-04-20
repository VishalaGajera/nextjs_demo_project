import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import type { AgColumnsWithActions } from "../../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../../types/dialogs";
import {
  dateFormat,
  formatHours,
  formatToLocalTime,
} from "../../../../../../../../utils/date";
import type { BankShiftDetail } from "./useGetBankShiftList";
type UseBankShiftListColumns = {
  loading: boolean;
  onAction: (actionType: DialogTypes, rowData: BankShiftDetail) => void;
};

export const useBankShiftListColumns = ({
  onAction,
  loading,
}: UseBankShiftListColumns) => {
  const columns: AgColumnsWithActions<BankShiftDetail> = [
    {
      minWidth: 200,
      headerName: "Company Name",
      field: "company_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      minWidth: 170,
      headerName: "Bank Shift Code",
      field: "bank_shift_type_code",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      minWidth: 200,
      headerName: "Bank Shift Name",
      field: "bank_shift_type_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      minWidth: 180,
      headerName: "Bank Shift Time",
      field: "shift_start",
      cellRenderer: ({ data }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Typography variant="body2">
            {data?.shift_start && data?.shift_end
              ? `${formatToLocalTime(data.shift_start)} - ${formatToLocalTime(data.shift_end)}`
              : "-"}
          </Typography>
        );
      },
      sortable: false,
    },
    {
      minWidth: 150,
      headerName: "Bank Shift Hours",
      field: "shift_hours",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Typography variant="body2">
            {value ? formatHours(value) : "-"}
          </Typography>
        );
      },
      sortable: true,
    },
    {
      minWidth: 150,
      headerName: "Break Gross Hours",
      field: "break_hours",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Typography variant="body2">
            {value ? formatHours(value) : "-"}
          </Typography>
        );
      },
      sortable: true,
    },
    {
      minWidth: 190,
      headerName: "Effective Gross Hours",
      field: "effective_work_hours",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Typography variant="body2">
            {value ? formatHours(value) : "-"}
          </Typography>
        );
      },
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "Action By",
      field: "action_by",
      cellRenderer: ({ data }: CustomCellRendererProps<BankShiftDetail>) => {
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
      cellRenderer: ({ data }: CustomCellRendererProps<BankShiftDetail>) => {
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

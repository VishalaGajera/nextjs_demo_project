import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { capitalize } from "lodash";
import { DateTime } from "luxon";
import type { AgColumnsWithActions } from "../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../types/dialogs";
import { CustomEnumFilter } from "../../../../../../../utils/ag-grid-custom-filter";
import { dateFormat, formatHours } from "../../../../../../../utils/date";
import type { ShiftDetail } from "./useGetShiftList";

type UseShiftListColumns = {
  loading: boolean;
  onAction: (actionType: DialogTypes, rowData: ShiftDetail) => void;
};

export const useShiftListColumns = ({
  onAction,
  loading,
}: UseShiftListColumns) => {
  const columns: AgColumnsWithActions<ShiftDetail> = [
    {
      minWidth: 200,
      headerName: "Company",
      field: "company_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <span>{value ?? "-"}</span>;
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "Shift Code",
      field: "shift_type_code",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <span>{value ?? "-"}</span>;
      },
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      minWidth: 200,
      headerName: "Shift Name",
      field: "shift_type_name",
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
      headerName: "Shift Type",
      field: "shift_type",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <span>{capitalize(value) ?? "-"}</span>;
      },
      sortable: true,
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: [
          { label: "Fixed", value: "fixed" },
          { label: "Flexible", value: "flexible" },
          { label: "Auto", value: "auto" },
        ],
      },
    },
    {
      minWidth: 200,
      headerName: "Shift Time",
      field: "shift_time",
      cellRenderer: ({ data }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <span>
            {data?.shift_start && data?.shift_end
              ? `${DateTime.fromISO(data.shift_start).toFormat(
                  "HH:mm"
                )} - ${DateTime.fromISO(data.shift_end).toFormat("HH:mm")}`
              : "-"}
          </span>
        );
      },
      sortable: false,
    },
    {
      minWidth: 200,
      headerName: "Shift Gross Hours",
      field: "shift_gross_hours",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <span>{value ? formatHours(value) : "-"}</span>;
      },
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "Break Gross Hours",
      field: "break_gross_hours",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <span>{value ? formatHours(value) : "-"}</span>;
      },
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "Effective Work Hours",
      field: "effective_work_hours",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <span>{value ? formatHours(value) : "-"}</span>;
      },
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "Half Day Min Hours",
      field: "min_half_day_hours",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <span>{value ? formatHours(value) : "-"}</span>;
      },
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "Full Day Min Hours",
      field: "min_full_day_hours",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <span>{value ? formatHours(value) : "-"}</span>;
      },
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "Action By",
      field: "action_by",
      cellRenderer: ({ data }: CustomCellRendererProps<ShiftDetail>) => {
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
      cellRenderer: ({ data }: CustomCellRendererProps<ShiftDetail>) => {
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

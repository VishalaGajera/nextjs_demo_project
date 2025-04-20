import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { DateTime } from "luxon";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../utils/date";
import type { Holiday } from "./useGetHolidays";

type UseHolidayColumnsArgs = {
  onAction: (actionType: DialogTypes, rowData: Holiday) => void;
};

export const useHolidaysColumns = ({
  onAction,
  loading,
}: AgColumnsArgs<UseHolidayColumnsArgs>) => {
  const columns: AgColumnsWithActions<Holiday> = [
    {
      headerName: "Holiday Name",
      field: "holiday_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value;
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      headerName: "Holiday Date",
      field: "holiday_date",
      filter: "agDateColumnFilter",
      filterParams: {
        minValidYear: 1970,
        maxValidYear: DateTime.now().year,
      },
      sortable: true,
      cellRenderer: ({ data }: CustomCellRendererProps<Holiday>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Typography variant="body2">
            {dateFormat(data.holiday_date, true)}{" "}
            {` (${DateTime.fromISO(data.holiday_date).toFormat("cccc")})`}
          </Typography>
        );
      },
    },
    {
      headerName: "Description",
      field: "description",
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
      headerName: "Action By",
      field: "action_by",
      filter: "agTextColumnFilter",
      sortable: true,
      cellRenderer: ({ data }: CustomCellRendererProps<Holiday>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Stack>
            <Typography variant="body2">{data.action_by}</Typography>

            <Typography variant="body2">
              {dateFormat(data.action_at)}
            </Typography>
          </Stack>
        );
      },
    },
    {
      headerName: "",
      field: "action",
      sortable: false,
      pinned: "right",
      maxWidth: 70,
      lockPinned: true,
      cellRenderer: ({ data }: CustomCellRendererProps<Holiday>) => {
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

import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../../../utils/date";
import type { GratuityInfo } from "../Dialogs/Hooks/getGratuityById";

type UseGratuityColumns = {
  onAction?: (actionType: DialogTypes, rowData: GratuityInfo) => void;
};

export const useGratuityColumns = ({
  onAction,
  loading,
}: AgColumnsArgs<UseGratuityColumns>) => {
  const columns: AgColumnsWithActions<GratuityInfo> = [
    {
      headerName: "Company",
      field: "company_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!value) {
          return null;
        }

        return value ? value : "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      headerName: "Min Tenure Years",
      field: "min_tenure_year",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!value) {
          return null;
        }

        return value ? value : "-";
      },
      sortable: false,
    },
    {
      headerName: "Yearly Days",
      field: "number_of_days_in_year",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!value) {
          return null;
        }

        return value ? value : "-";
      },
      sortable: true,
    },
    {
      headerName: "Monthly Work Days",
      field: "avg_monthly_working_day",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!value) {
          return null;
        }

        return value ? value : "-";
      },
      sortable: true,
    },
    {
      headerName: "Action By",
      field: "action_by",
      cellRenderer: ({ data }: CustomCellRendererProps<GratuityInfo>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        if (data) {
          return (
            <Stack>
              <Typography variant="body2">{data?.action_by}</Typography>

              <Typography variant="body2">
                {dateFormat(data?.action_at ? data?.action_at : "")}
              </Typography>
            </Stack>
          );
        }
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      headerName: "",
      field: "action",
      sortable: false,
      pinned: "right",
      lockPinned: true,
      maxWidth: 70,
      cellRenderer: ({ data }: CustomCellRendererProps<GratuityInfo>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        const items = [
          { title: "View", onClick: () => onAction && onAction("view", data) },
          { title: "Edit", onClick: () => onAction && onAction("edit", data) },
          {
            title: "Delete",
            onClick: () => onAction && onAction("delete", data),
          },
        ];

        return <ActionCell items={items}></ActionCell>;
      },
    },
  ];

  return { columns };
};

import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../../../types/dialogs";
import {
  calculateDateDifference,
  dateFormat,
} from "../../../../../../../../../utils/date";
import type { PastWorkEmployment } from "./useGetPastWorkEmployments";
type UsePastWorkEmploymentColumns = {
  onAction: (actionType: DialogTypes, rowData: PastWorkEmployment) => void;
};

export const usePastWorkEmploymentColumns = ({
  onAction,
  loading,
}: AgColumnsArgs<UsePastWorkEmploymentColumns>) => {
  const columns: AgColumnsWithActions<PastWorkEmployment> = [
    {
      headerName: "Company Name",
      field: "company_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value;
      },
      sortable: true,
    },
    {
      headerName: "Designation",
      field: "designation",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value;
      },
      sortable: true,
    },
    {
      headerName: "From Date",
      field: "from_date",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Typography variant="body2">
            {value ? dateFormat(value, true) : "-"}
          </Typography>
        );
      },
      sortable: true,
    },
    {
      headerName: "To Date",
      field: "to_date",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Typography variant="body2">
            {value ? dateFormat(value, true) : "-"}
          </Typography>
        );
      },
      sortable: true,
    },
    {
      headerName: "Total Experience",
      field: "to_date",
      cellRenderer: ({ data }: CustomCellRendererProps<PastWorkEmployment>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        return (
          <Typography variant="body2">
            {data.from_date &&
              data.to_date &&
              calculateDateDifference(data.from_date, data.to_date)}
          </Typography>
        );
      },
      sortable: true,
    },
    {
      headerName: "Address",
      field: "address",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      sortable: true,
    },
    {
      headerName: "Leaving Reason",
      field: "leaving_reason",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value;
      },
      sortable: true,
    },
    {
      headerName: "Action By",
      field: "action_by",
      sortable: true,
      cellRenderer: ({ data }: CustomCellRendererProps<PastWorkEmployment>) => {
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
      cellRenderer: ({ data }: CustomCellRendererProps<PastWorkEmployment>) => {
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

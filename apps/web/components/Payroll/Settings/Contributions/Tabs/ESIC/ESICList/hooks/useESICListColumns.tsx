import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../../../utils/date";
import type { ESICRecord } from "./useGetESICList";

type UseESICColumnsProps = {
  loading: boolean;
  onAction: (actionType: DialogTypes, rowData: ESICRecord) => void;
};

export const useESICColumns = ({
  loading,
  onAction,
}: AgColumnsArgs<UseESICColumnsProps>) => {
  const columns: AgColumnsWithActions<ESICRecord> = [
    {
      headerName: "ESIC Group Name",
      field: "esic_group_name",
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
      headerName: "Employee's Contribution",
      field: "employee_contribution_rate",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Typography variant="body2">
            {value ? `${value}% of Gross Salary` : "-"}
          </Typography>
        );
      },
      filter: "agNumberColumnFilter",
      sortable: true,
    },
    {
      headerName: "Employer's Contribution",
      field: "employer_contribution_rate",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Typography variant="body2">
            {value ? `${value}% of Gross Salary` : "-"}
          </Typography>
        );
      },
      filter: "agNumberColumnFilter",
      sortable: true,
    },
    {
      headerName: "Action By",
      field: "action_by",
      filter: "agTextColumnFilter",
      cellRenderer: ({ data }: CustomCellRendererProps<ESICRecord>) => {
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
      cellRenderer: ({ data }: CustomCellRendererProps<ESICRecord>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        return (
          <ActionCell
            items={[
              { title: "View", onClick: () => onAction("view", data) },
              { title: "Edit", onClick: () => onAction("edit", data) },
              { title: "Delete", onClick: () => onAction("delete", data) },
            ]}
          ></ActionCell>
        );
      },
    },
  ];

  return { columns };
};

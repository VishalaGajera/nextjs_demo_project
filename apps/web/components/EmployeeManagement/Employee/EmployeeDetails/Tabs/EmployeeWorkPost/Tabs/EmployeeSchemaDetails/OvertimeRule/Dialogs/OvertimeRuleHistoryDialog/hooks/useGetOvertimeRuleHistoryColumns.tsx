import { Chip, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography, useTheme } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../../../../../../types/agGrid";
import { dateFormat } from "../../../../../../../../../../../../utils/date";
import {
  StatusColorOptions,
  StatusOptions,
  type Histories,
} from "../../../../../EmployeeOrganizationDetails/hooks/useGetOrganizationHistory";

type UseGetOvertimeRuleHistoryColumns = {
  loading: boolean;
};

export const useGetOvertimeRuleHistoryColumns = ({
  loading,
}: AgColumnsArgs<UseGetOvertimeRuleHistoryColumns>) => {
  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  const column: AgColumnsWithActions<Histories> = [
    {
      headerName: "Overtime Rule Name",
      field: "name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          value ?? (
            <Typography
              variant="subtitle2"
              fontWeight={400}
              sx={{ color: iron[800] }}
            >
              No Rule Assigned
            </Typography>
          )
        );
      },
      sortable: true,
      floatingFilter: false,
    },
    {
      headerName: "Status",
      field: "status",
      cellRenderer: ({ data }: CustomCellRendererProps<Histories>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Chip
            label={StatusOptions[data.status]}
            size="small"
            color={StatusColorOptions[data.status]}
            variant="outlined"
          />
        );
      },
      sortable: true,
      floatingFilter: false,
    },
    {
      headerName: "Effective From",
      field: "effective_from",

      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return dateFormat(value, true) ?? "-";
      },
      sortable: true,
      floatingFilter: false,
    },
    {
      headerName: "Effective To",
      field: "effective_to",

      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? dateFormat(value, true) : "No End Date Yet";
      },
      sortable: true,
      floatingFilter: false,
    },
    {
      headerName: "Remark",
      field: "remark",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      sortable: true,
      floatingFilter: false,
    },
    {
      headerName: "Change Date",
      field: "action_at",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <Stack>{dateFormat(value) ?? "-"}</Stack>;
      },
      sortable: true,
      floatingFilter: false,
    },
    {
      headerName: "Action By",
      field: "action_by",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "";
      },
      floatingFilter: false,
    },
  ];

  return { column };
};

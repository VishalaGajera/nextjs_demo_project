import { Chip, getTimeInHHmm, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
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

type UseBankShiftColumns = {
  loading: boolean;
};

export const useGetBankShiftHistoryColumns = ({
  loading,
}: AgColumnsArgs<UseBankShiftColumns>) => {
  const column: AgColumnsWithActions<Histories> = [
    {
      headerName: "Bank Shift",
      field: "name",
      cellRenderer: ({ data }: CustomCellRendererProps<Histories>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Stack gap="2px" justifyContent="center">
            <Typography variant="body2">{data.name ?? "-"}</Typography>

            <Typography variant="body2">
              {data.shift_start && data.shift_end
                ? `${getTimeInHHmm(data.shift_start)} - ${getTimeInHHmm(data.shift_end)}`
                : "-"}
            </Typography>
          </Stack>
        );
      },
      sortable: false,
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

import { Chip, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../../../../../types/agGrid";
import { dateFormat } from "../../../../../../../../../../../utils/date";
import {
  type Histories,
  StatusColorOptions,
  StatusOptions,
} from "../../../../../../EmployeeWorkPost/Tabs/EmployeeOrganizationDetails/hooks/useGetOrganizationHistory";
import type { StatutoryHistoryType } from "./useGetStatutoryHistory";

type UseGetStatutoryHistoryColumns = {
  loading: boolean;
};

export const useGetStatutoryHistoryColumns = ({
  loading,
}: AgColumnsArgs<UseGetStatutoryHistoryColumns>) => {
  const column: AgColumnsWithActions<StatutoryHistoryType> = [
    {
      headerName: "Status",
      field: "status",
      minWidth: 120,
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
      minWidth: 150,

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
      minWidth: 150,

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
      headerName: "PF Applicable",
      field: "pt_applicable",
      minWidth: 150,
      sortable: false,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? <Chip label="Yes" /> : <Chip label="No" color="error" />;
      },
    },
    {
      headerName: "PF Group",
      field: "epf_group_name",
      minWidth: 200,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      sortable: false,
      floatingFilter: false,
    },
    {
      headerName: "PF No",
      field: "pf_account_no",
      minWidth: 200,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      sortable: false,
      floatingFilter: false,
    },
    {
      headerName: "PF Joining Date",
      field: "pf_joining_date",
      minWidth: 150,

      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? dateFormat(value, true) : "-";
      },
      sortable: false,
      floatingFilter: false,
    },
    {
      headerName: "UAN No",
      field: "uan_no",
      minWidth: 200,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      sortable: false,
      floatingFilter: false,
    },
    {
      headerName: "ESIC Applicable",
      field: "esic_applicable",
      minWidth: 150,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? <Chip label="Yes" /> : <Chip label="No" color="error" />;
      },
      sortable: false,
      floatingFilter: false,
    },
    {
      headerName: "ESIC Group",
      field: "esic_group_name",
      minWidth: 200,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      sortable: false,
      floatingFilter: false,
    },
    {
      headerName: "ESIC No",
      field: "esic_no",
      minWidth: 200,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      sortable: false,
      floatingFilter: false,
    },
    {
      headerName: "ESIC Joining Date",
      field: "esic_joining_date",
      minWidth: 160,

      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return dateFormat(value, true) ?? "-";
      },
      sortable: false,
      floatingFilter: false,
    },
    {
      headerName: "LWF Applicable",
      field: "lwf_applicable",
      minWidth: 150,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? <Chip label="Yes" /> : <Chip label="No" color="error" />;
      },
      sortable: false,
      floatingFilter: false,
    },
    {
      headerName: "PT Applicable",
      field: "pt_applicable",
      minWidth: 150,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? <Chip label="Yes" /> : <Chip label="No" color="error" />;
      },
      sortable: false,
      floatingFilter: false,
    },
    {
      headerName: "TDS Applicable",
      field: "tds_applicable",
      minWidth: 150,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? <Chip label="Yes" /> : <Chip label="No" color="error" />;
      },
      sortable: false,
      floatingFilter: false,
    },
    {
      headerName: "Tax Regime",
      field: "tax_regime_name",
      minWidth: 150,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "";
      },
      sortable: false,
      floatingFilter: false,
    },
    {
      headerName: "Change Date",
      field: "action_at",
      minWidth: 200,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <Stack>{dateFormat(value) ?? "-"}</Stack>;
      },
      sortable: true,
    },
    {
      headerName: "Action By",
      field: "action_by",
      minWidth: 150,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "";
      },
    },
  ];

  return { column };
};

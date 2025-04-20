import { Chip, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { capitalize } from "lodash";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../../../../../types/agGrid";
import { dateFormat } from "../../../../../../../../../../../utils/date";
import {
  type Histories,
  type StatusKeys,
  StatusColorOptions,
  StatusOptions,
} from "../../../../../../EmployeeWorkPost/Tabs/EmployeeOrganizationDetails/hooks/useGetOrganizationHistory";
import type { PaymentDetails } from "../../../EditPaymentDetailsDialog/hooks/useGetPaymentDetails";

type UsePaymentHistoryColumns = {
  loading: boolean;
};
export type PaymentHistoryType = PaymentDetails & {
  action_at: string;
  action_by: string;
  effective_from: string;
  effective_to: string | null;
  status: StatusKeys;
};
export const useGetPaymentHistoryColumns = ({
  loading,
}: AgColumnsArgs<UsePaymentHistoryColumns>) => {
  const column: AgColumnsWithActions<PaymentHistoryType> = [
    {
      headerName: "Payment Type",
      field: "payment_type",

      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return capitalize(value);
      },
      sortable: true,
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
      headerName: "Bank Name",
      field: "bank_name",

      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? capitalize(value) : "-";
      },
      sortable: true,
    },
    {
      headerName: "Bank Branch",
      field: "branch_name",

      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? capitalize(value) : "-";
      },
      sortable: true,
    },
    {
      headerName: "Account Type",
      field: "account_type",

      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? capitalize(value) : "-";
      },
      sortable: true,
    },
    {
      headerName: "Account No",
      field: "account_no",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      sortable: true,
    },
    {
      headerName: "IFSC Code",
      field: "ifsc_code",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      sortable: true,
    },
    {
      headerName: "Name As Per Bank",
      field: "name_as_per_bank",

      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? capitalize(value) : "-";
      },
      sortable: true,
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
    },
  ];

  return { column };
};

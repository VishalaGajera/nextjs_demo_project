import { Chip, formatDate, LoadingCell } from "@codezee/sixtify-brahma";
import { Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../types/agGrid";
import type { LeaveBalanceType } from "../../hooks/useGetLeaveDetails";

type UseLeaveHistoryColumns = {
  loading: boolean;
};

export type LeaveHistoryType = LeaveBalanceType & {
  id: string;
  transaction_date: string;
  change_duration: string;
  balance_duration: string;
  reason: string;
};

export const useGetLeaveHistoryColumns = ({
  loading,
}: AgColumnsArgs<UseLeaveHistoryColumns>) => {
  const column: AgColumnsWithActions<LeaveHistoryType> = [
    {
      maxWidth: 250,
      headerName: "Transaction Date",
      field: "transaction_date",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Typography variant="body2">
            {value ? formatDate(value, "dd-MMM-yyyy") : "-"}
          </Typography>
        );
      },
      sortable: false,
    },
    {
      maxWidth: 200,
      headerName: "Leave Balance Change",
      field: "change_duration",

      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (value) {
          return (
            <Chip
              variant="outlined"
              size="small"
              color={value > 0 ? "success" : "error"}
              label={`${value > 0 ? "+" : ""}${value}`}
            />
          );
        }

        return "-";
      },
      sortable: false,
    },
    {
      maxWidth: 200,
      headerName: "Balance",
      field: "balance_duration",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      sortable: false,
    },
    {
      headerName: "Activity Type",
      field: "reason",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      sortable: false,
    },
  ];

  return { column };
};

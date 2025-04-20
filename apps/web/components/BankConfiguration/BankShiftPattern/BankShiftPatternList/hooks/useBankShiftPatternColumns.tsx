import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { capitalize } from "lodash";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../types/dialogs";
import { CustomEnumFilter } from "../../../../../utils/ag-grid-custom-filter";
import { dateFormat } from "../../../../../utils/date";
import type { BankShiftPattern } from "./useGetBankShiftPatterns";

type UseBankShiftPatternColumns = {
  loading: boolean;
  onAction: (actionType: DialogTypes, rowData: BankShiftPattern) => void;
};

export const useBankShiftPatternColumns = ({
  loading,
  onAction,
}: AgColumnsArgs<UseBankShiftPatternColumns>) => {
  const columns: AgColumnsWithActions<BankShiftPattern> = [
    {
      headerName: "Company Name",
      field: "company_name",
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
      headerName: "Bank Shift Pattern Name",
      field: "bank_shift_pattern_name",
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
      headerName: "Bank Shift Pattern Type",
      field: "pattern_type",

      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? capitalize(value) : "-";
      },
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: [
          { label: "Monthly", value: "monthly" },
          { label: "Weekly", value: "weekly" },
        ],
      },
      sortable: true,
    },
    {
      headerName: "Bank Shift Pattern Changes",
      field: "pattern_repeat",
      cellRenderer: ({ data }: CustomCellRendererProps<BankShiftPattern>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Typography variant="body2">
            Every {data.pattern_repeat}{" "}
            {data.pattern_type === "weekly" ? "Week" : "Month"}
          </Typography>
        );
      },
      sortable: true,
    },
    {
      headerName: "Action By",
      field: "action_by",
      filter: "agTextColumnFilter",
      sortable: true,
      cellRenderer: ({ data }: CustomCellRendererProps<BankShiftPattern>) => {
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
      maxWidth: 100,
      cellRenderer: ({ data }: CustomCellRendererProps<BankShiftPattern>) => {
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

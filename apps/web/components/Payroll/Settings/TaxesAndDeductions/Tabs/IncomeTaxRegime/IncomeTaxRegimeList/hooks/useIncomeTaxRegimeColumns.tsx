import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { capitalize, get } from "lodash";
import { DateTime } from "luxon";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../../types/dialogs";
import { CustomEnumFilter } from "../../../../../../../../utils/ag-grid-custom-filter";
import { dateFormat } from "../../../../../../../../utils/date";
import { type IncomeTaxRegimes } from "./useGeIncomeTaxRegimeList";

type UseIncomeTaxRegimeColumns = {
  onAction: (actionType: DialogTypes, rowData: IncomeTaxRegimes) => void;
};

export const useIncomeTaxRegimeColumns = ({
  loading,
  onAction,
}: AgColumnsArgs<UseIncomeTaxRegimeColumns>) => {
  const column: AgColumnsWithActions<IncomeTaxRegimes> = [
    {
      headerName: "Financial Year",
      field: "financial_year",
      cellRenderer: ({ value }: CustomCellRendererProps<IncomeTaxRegimes>) => {
        if (loading) {
          return <LoadingCell />;
        }

        const startYear = DateTime.fromISO(get(value, "start_date", "")).year;

        const endYear = DateTime.fromISO(get(value, "end_date", "")).year;

        return (
          <Typography variant="body2">{`${startYear}-${endYear}`}</Typography>
        );
      },
      sortable: true,
    },
    {
      headerName: "Regime Type",
      field: "regime_type",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <Typography variant="body2">{capitalize(value)}</Typography>;
      },
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: [
          { value: "old", label: "Old Tax Regime" },
          { value: "new", label: "New Tax Regime" },
        ],
      },
      sortable: true,
    },
    {
      headerName: "Action By",
      field: "action_by",
      filter: "agTextColumnFilter",
      sortable: true,
      cellRenderer: ({ data }: CustomCellRendererProps) => {
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
      lockPinned: true,
      maxWidth: 70,
      cellRenderer: ({ data }: CustomCellRendererProps) => {
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

  return { column };
};

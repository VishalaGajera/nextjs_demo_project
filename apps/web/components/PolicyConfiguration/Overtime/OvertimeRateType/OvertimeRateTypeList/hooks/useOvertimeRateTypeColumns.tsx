import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";

import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../types/dialogs";
import { CustomEnumFilter } from "../../../../../../utils/ag-grid-custom-filter";
import { dateFormat } from "../../../../../../utils/date";
import {
  OvertimeTypeOptions,
  type OvertimeTypeOptionsKey,
} from "../../../../../common/Autocomplete/hooks/useGetOvertimeTypeOptions";
import type { OvertimeRateType } from "./useGetOvertimeRateTypes";

type UseOvertimeRateTypeColumns = {
  onAction: (actionType: DialogTypes, rowData: OvertimeRateType) => void;
};

export const useOvertimeRateTypeColumns = ({
  onAction,
  loading,
}: AgColumnsArgs<UseOvertimeRateTypeColumns>) => {
  const columns: AgColumnsWithActions<OvertimeRateType> = [
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
      headerName: "Overtime Rate Code",
      field: "overtime_rate_code",
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
      headerName: "Overtime Rate",
      field: "overtime_rate_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      headerName: "Calculation Type",
      field: "overtime_type",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value && OvertimeTypeOptions[value as OvertimeTypeOptionsKey];
      },

      sortable: true,
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: [
          { label: "Custom OT", value: "custom_ot" },
          { label: "Fixed OT", value: "fixed_ot" },
        ],
      },
    },
    {
      headerName: "Action By",
      field: "action_by",
      filter: "agTextColumnFilter",
      sortable: true,
      cellRenderer: ({ data }: CustomCellRendererProps<OvertimeRateType>) => {
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
      cellRenderer: ({ data }: CustomCellRendererProps<OvertimeRateType>) => {
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

import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../types/dialogs";
import { CustomEnumFilter } from "../../../../../../../utils/ag-grid-custom-filter";
import { dateFormat } from "../../../../../../../utils/date";
import type { PtGroupType } from "./useGetProfessionalTaxList";

type UseProfessionalTaxesColumnsProps = {
  onAction?: (actionType: DialogTypes, rowData: PtGroupType) => void;
};

const deductionCycleLabels: Record<
  "half_yearly" | "monthly" | "quarterly" | "yearly",
  string
> = {
  half_yearly: "Half Yearly",
  monthly: "Monthly",
  yearly: "Yearly",
  quarterly: "Quarterly",
};

export const useProfessionalTaxesColumns = ({
  loading,
  onAction,
}: AgColumnsArgs<UseProfessionalTaxesColumnsProps>) => {
  const column: AgColumnsWithActions<PtGroupType> = [
    {
      headerName: "State",
      field: "state_name",
      cellRenderer: ({ value }: CustomCellRendererProps<PtGroupType>) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      headerName: "Deduction Cycle",
      field: "deduction_cycle_type",
      cellRenderer: ({ data }: CustomCellRendererProps<PtGroupType>) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Typography variant="body2">
            {data?.deduction_cycle_type
              ? deductionCycleLabels[data.deduction_cycle_type]
              : "-"}
          </Typography>
        );
      },
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: [
          { value: "half_yearly", label: "Half Yearly" },
          { value: "monthly", label: "Monthly" },
          { value: "yearly", label: "Yearly" },
          { value: "quarterly", label: "Quarterly" },
        ],
      },
      sortable: true,
    },
    {
      headerName: "Action By",
      field: "action_by",
      filter: "agTextColumnFilter",
      sortable: true,
      cellRenderer: ({ data }: CustomCellRendererProps<PtGroupType>) => {
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
      cellRenderer: ({ data }: CustomCellRendererProps<PtGroupType>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        const items = [
          { title: "View", onClick: () => onAction && onAction("view", data) },
          { title: "Edit", onClick: () => onAction && onAction("edit", data) },
          {
            title: "Delete",
            onClick: () => onAction && onAction("delete", data),
          },
        ];

        return <ActionCell items={items}></ActionCell>;
      },
    },
  ];

  return { column };
};

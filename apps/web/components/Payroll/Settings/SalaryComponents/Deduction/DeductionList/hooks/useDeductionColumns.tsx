import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import type { CustomCellRendererProps } from "ag-grid-react";

import { Typography } from "@mui/material";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../types/dialogs";
import { CustomEnumFilter } from "../../../../../../../utils/ag-grid-custom-filter";
import {
  DeductionComponentTypeOptions,
  type DeductionComponentTypeOptionsKey,
} from "../../../../../../common/Autocomplete/hooks/useGetDeductionComponentOptions";
import {
  SalaryComponentTypeOptions,
  type SalaryComponentTypeOptionsKey,
} from "../../../../../../common/Autocomplete/hooks/useGetSalaryComponentTypeOptions";
import { getDisplayText } from "../../../../../../common/GetDisplayText";
import type { SalaryComponent } from "../../../SalaryComponentForm";

type UseDeductionColumns = {
  onAction: (actionType: DialogTypes, rowData: SalaryComponent) => void;
};
export const useDeductionColumns = ({
  onAction,
  loading,
}: AgColumnsArgs<UseDeductionColumns>) => {
  const columns: AgColumnsWithActions<SalaryComponent> = [
    {
      headerName: "Component Code",
      field: "deduction_component_code",
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
      headerName: "Component Name",
      field: "deduction_component_name",
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
      headerName: "Calculation type",
      field: "calculation_type",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          value &&
          SalaryComponentTypeOptions[value as SalaryComponentTypeOptionsKey]
        );
      },
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: [
          { label: "Recurring", value: "recurring" },
          { label: "One Time", value: "one_time" },
        ],
      },
      sortable: true,
    },
    {
      headerName: "Deduction Component type",
      field: "deduction_component_type",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          value &&
          DeductionComponentTypeOptions[
            value as DeductionComponentTypeOptionsKey
          ]
        );
      },
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: [
          { label: "Deduction", value: "deduction" },
          { label: "Tax", value: "tax" },
        ],
      },
      sortable: true,
    },
    {
      headerName: "Taxable",
      field: "is_taxable",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <Typography>{getDisplayText(value)}</Typography>;
      },
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
      },
      sortable: true,
    },
    {
      headerName: "",
      field: "action",
      sortable: false,
      pinned: "right",
      maxWidth: 70,
      lockPinned: true,
      cellRenderer: ({ data }: CustomCellRendererProps<SalaryComponent>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        const view = { title: "View", onClick: () => onAction("view", data) };

        const edit = { title: "Edit", onClick: () => onAction("edit", data) };

        const del = {
          title: "Delete",
          onClick: () => onAction("delete", data),
        };

        const items = data.is_system_generated
          ? [view, edit]
          : [view, edit, del];

        return <ActionCell items={items} />;
      },
    },
  ];

  return { columns };
};

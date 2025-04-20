import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../types/dialogs";
import { CustomEnumFilter } from "../../../../../../../utils/ag-grid-custom-filter";
import {
  EarningComponentTypeOptions,
  type EarningComponentTypeOptionsKey,
} from "../../../../../../common/Autocomplete/hooks/useGetEarningComponentTypeOptions";
import {
  SalaryComponentTypeOptions,
  type SalaryComponentTypeOptionsKey,
} from "../../../../../../common/Autocomplete/hooks/useGetSalaryComponentTypeOptions";
import { getDisplayText } from "../../../../../../common/GetDisplayText";
import type { Earning } from "./useGetEarnings";

type UseEarningColumns = {
  onAction: (actionType: DialogTypes, rowData: Earning) => void;
};

export const useEarningColumns = ({
  onAction,
  loading,
}: AgColumnsArgs<UseEarningColumns>) => {
  const columns: AgColumnsWithActions<Earning> = [
    {
      headerName: "Component Code",
      field: "earning_component_code",
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
      field: "earning_component_name",
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
      headerName: "Calculation Type",
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
      headerName: "Earning Component Type",
      field: "earning_component_type",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          value &&
          EarningComponentTypeOptions[value as EarningComponentTypeOptionsKey]
        );
      },
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: [
          { label: "Fixed", value: "fixed" },
          { label: "Allowance", value: "allowance" },
          { label: "Arrear", value: "arrear" },
          { label: "Bonus", value: "bonus" },
          { label: "Advance", value: "advance" },
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
      headerName: "PF",
      field: "consider_for_pf",
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
      headerName: "ESI",
      field: "consider_for_esi",
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
      headerName: "PT",
      field: "consider_for_pt",
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
      cellRenderer: ({ data }: CustomCellRendererProps<Earning>) => {
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

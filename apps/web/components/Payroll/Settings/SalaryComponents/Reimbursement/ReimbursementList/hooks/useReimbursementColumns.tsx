import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import type { CustomCellRendererProps } from "ag-grid-react";

import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../types/dialogs";
import { CustomEnumFilter } from "../../../../../../../utils/ag-grid-custom-filter";
import {
  SalaryComponentTypeOptions,
  type SalaryComponentTypeOptionsKey,
} from "../../../../../../common/Autocomplete/hooks/useGetSalaryComponentTypeOptions";
import type { SalaryComponent } from "../../../SalaryComponentForm";

type UseReimbursementColumns = {
  onAction: (actionType: DialogTypes, rowData: SalaryComponent) => void;
};

export const useReimbursementColumns = ({
  onAction,
  loading,
}: AgColumnsArgs<UseReimbursementColumns>) => {
  const columns: AgColumnsWithActions<SalaryComponent> = [
    {
      headerName: "Component Code",
      field: "reimbursement_component_code",
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
      field: "reimbursement_component_name",
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

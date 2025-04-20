import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../types/dialogs";
import type { ExcelTemplateFields } from "../../ExcelTemplateConfigurationForm";

type UseExcelTemplateConfigurationColumns = {
  onAction: (
    actionType: DialogTypes,
    rowData: ExcelTemplateFields[number]
  ) => void;
  loading: boolean;
  disabled?: boolean;
};

export const useExcelTemplateConfigurationColumns = ({
  onAction,
  loading,
  disabled,
}: AgColumnsArgs<UseExcelTemplateConfigurationColumns>) => {
  const column: AgColumnsWithActions<ExcelTemplateFields[number]> = [
    {
      headerName: "Default Field Name",
      field: "field_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value;
      },
      sortable: false,
    },
    {
      headerName: "Template Field Name",
      field: "template_field_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      sortable: false,
    },
    {
      headerName: "",
      field: "action",
      sortable: false,
      pinned: "right",
      maxWidth: 70,
      lockPinned: true,
      cellRenderer: ({
        data,
      }: CustomCellRendererProps<ExcelTemplateFields[number]>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        const items = [
          { title: "Edit", onClick: () => onAction("edit", data) },
        ];

        return <ActionCell items={items} disabled={disabled}></ActionCell>;
      },
    },
  ];

  return { column };
};

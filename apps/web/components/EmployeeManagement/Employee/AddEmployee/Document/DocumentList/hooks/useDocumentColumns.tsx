import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../types/dialogs";
import type { DocumentFormFieldValues } from "../../Dialog/DocumentForm";
import type { DocumentOptionKey } from "../../Dialog/hooks/useDocumentOptions";
import { DocumentOptions } from "../../Dialog/hooks/useDocumentOptions";

type UseDocumentColumns = {
  onAction: (actionType: DialogTypes, rowData: DocumentFormFieldValues) => void;
};

export const useDocumentColumns = ({
  onAction,
}: AgColumnsArgs<UseDocumentColumns>) => {
  const column: AgColumnsWithActions<DocumentFormFieldValues> = [
    {
      headerName: "Document Type",
      field: "document_type",
      cellRenderer: ({
        data,
      }: CustomCellRendererProps<DocumentFormFieldValues>) => {
        if (!data) {
          return "-";
        }

        return (
          data.document_type &&
          DocumentOptions[data.document_type as DocumentOptionKey]
        );
      },
      sortable: true,
    },
    {
      headerName: "Document No",
      field: "document_no",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return value ? value : "-";
      },
    },
    {
      headerName: "Name As Per Document",
      field: "name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return value ? value : " -";
      },
    },
    {
      headerName: "",
      field: "action",
      sortable: false,
      pinned: "right",
      maxWidth: 70,
      lockPinned: true,
      cellRenderer: ({ data }: CustomCellRendererProps) => {
        if (!data) {
          return <LoadingCell />;
        }

        const items = [
          { title: "Edit", onClick: () => onAction("edit", data) },
          { title: "Delete", onClick: () => onAction("delete", data) },
        ];

        return <ActionCell items={items}></ActionCell>;
      },
    },
  ];

  return { column };
};

import { AgGrid } from "@codezee/sixtify-brahma";
import { useState } from "react";
import type { UseFormSetValue } from "react-hook-form";
import { useApplicationContext } from "../../../../../../app/context/ApplicationContext";
import { useDialogActions } from "../../../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../../../types/dialogs";
import type { EmployeeFormFieldValues } from "../../EmployeeForm";
import { DeleteDocumentDialog } from "../Dialog/DeleteDocumentDialog";
import type { DocumentFormFieldValues } from "../Dialog/DocumentForm";
import { EditDocumentDialog } from "../Dialog/EditDocumentDialog";
import { useDocumentColumns } from "./hooks/useDocumentColumns";

type DocumentListProps = {
  setFieldValue: UseFormSetValue<EmployeeFormFieldValues>;
};

export const DocumentList = ({ setFieldValue }: DocumentListProps) => {
  const [currentDocument, setCurrentDocument] =
    useState<DocumentFormFieldValues>();

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const { column } = useDocumentColumns({
    onAction: (actionType, document) => {
      onDialogOpen(actionType);
      setCurrentDocument(document);
    },
  });

  const { documentFormValues, setDocumentFormValues } = useApplicationContext();

  const dialogRenderer: DialogRenderer = {
    edit: currentDocument && (
      <EditDocumentDialog
        open
        onClose={onDialogClose}
        document={currentDocument}
        onEdit={(formValues) => {
          const documentList = documentFormValues.map((document) => {
            if (document.document_type === currentDocument.document_type) {
              return { ...document, ...formValues };
            }

            return document;
          });

          setFieldValue("document_details", documentList);

          setDocumentFormValues(documentList);

          onDialogClose();
        }}
      />
    ),
    delete: currentDocument && (
      <DeleteDocumentDialog
        open
        onClose={onDialogClose}
        document={currentDocument}
        setFieldValue={setFieldValue}
      />
    ),
  };

  return (
    <>
      <AgGrid<DocumentFormFieldValues>
        rowData={documentFormValues}
        rowModelType="clientSide"
        columnDefs={column}
        height="calc(100vh - 600px)"
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useCallback } from "react";
import type { UseFormSetValue } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useApplicationContext } from "../../../../../../app/context/ApplicationContext";
import type { EmployeeFormFieldValues } from "../../EmployeeForm";
import type { DocumentFormFieldValues } from "./DocumentForm";
import type { DocumentOptionKey } from "./hooks/useDocumentOptions";
import { DocumentOptions } from "./hooks/useDocumentOptions";

type DeleteDocumentDialogProps = {
  open: boolean;
  onClose: () => void;
  setFieldValue: UseFormSetValue<EmployeeFormFieldValues>;
  document: DocumentFormFieldValues;
};

export const DeleteDocumentDialog = ({
  open,
  onClose,
  document,
  setFieldValue,
}: DeleteDocumentDialogProps) => {
  const { t } = useTranslation();

  const { documentFormValues, setDocumentFormValues } = useApplicationContext();

  const onDeleteDocumentHandler = useCallback(() => {
    const documentList = documentFormValues.filter(
      (documentObj) => documentObj.document_type !== document.document_type
    );

    setDocumentFormValues(documentList);

    setFieldValue("document_details", documentList);

    onClose();

    toasts.success({
      title: t("document.dialog.delete.success", {
        documentName:
          document.document_type &&
          DocumentOptions[document.document_type as DocumentOptionKey],
      }),
    });
  }, [documentFormValues, document]);

  // TODO: Manish, Wrong translation when delete degree & certificate.

  return (
    <DeleteDialog
      title={t("document.dialog.delete.message", {
        documentName:
          document.document_type &&
          DocumentOptions[document.document_type as DocumentOptionKey],
      })}
      open={open}
      isDeleteLoading={false}
      onDelete={() => onDeleteDocumentHandler()}
      onClose={() => onClose()}
    />
  );
};

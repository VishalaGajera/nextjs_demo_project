import { Button, Dialog } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { EditAction } from "../../../../../common/EditAction";
import type { DocumentFormFieldValues, FormRef } from "./DocumentForm";
import { DocumentForm } from "./DocumentForm";
import { useDocumentOptions } from "./hooks/useDocumentOptions";

type EditDocumentDialogProps = {
  open: boolean;
  document: DocumentFormFieldValues;
  onEdit: (formValues: Partial<DocumentFormFieldValues>) => void;
  onClose: () => void;
};

export const EditDocumentDialog = ({
  open,
  onEdit,
  document,
  onClose,
}: EditDocumentDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { documentTypeOptions } = useDocumentOptions();

  const onEditDocument = () => {
    formRef.current?.submitForm((formValues) => {
      onEdit(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Edit Document"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction onClick={onEditDocument} />
        </Stack>
      }
    >
      <DocumentForm
        ref={formRef}
        defaultValues={document}
        documentTypeOptions={documentTypeOptions}
      />
    </Dialog>
  );
};

import { Button, Dialog } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useMemo, useRef } from "react";
import type { FieldValues } from "react-hook-form";
import type { ApiErrorResponse } from "../../../../../../types/apiResponse";
import { onError } from "../../../../../../utils/errors";
import {
  DocumentForm,
  type DocumentFormFieldValues,
  type FormRef,
} from "./DocumentForm";
import type { DocumentTypeOptions } from "./hooks/useDocumentOptions";

type AddDocumentDialogProps = {
  open: boolean;
  onAdd: (formValues: Partial<DocumentFormFieldValues>) => void;
  onClose: () => void;
  loading?: boolean;
  documentErrors?: ApiErrorResponse<FieldValues> | null;
  documentTypeOptions: DocumentTypeOptions[];
};

export const AddDocumentDialog = ({
  open,
  onAdd,
  loading,
  onClose,
  documentErrors,
  documentTypeOptions,
}: AddDocumentDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const onCreateDocument = () => {
    formRef.current?.submitForm((formValues) => {
      onAdd(formValues);
    });
  };

  useMemo(() => {
    if (documentErrors) {
      onError(documentErrors, formRef.current?.setError);
    }
  }, [documentErrors]);

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Add Document"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button onClick={onCreateDocument} loading={loading}>
            Save
          </Button>
        </Stack>
      }
    >
      <DocumentForm ref={formRef} documentTypeOptions={documentTypeOptions} />
    </Dialog>
  );
};

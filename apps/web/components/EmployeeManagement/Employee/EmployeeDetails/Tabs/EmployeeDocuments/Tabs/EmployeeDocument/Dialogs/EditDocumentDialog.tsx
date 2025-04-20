import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useMemo, useRef } from "react";
import { onError } from "../../../../../../../../../utils/errors";
import { useGetDocumentOptions } from "../../../../../../../../common/Autocomplete/hooks/useGetDocumentOptions";
import { EditAction } from "../../../../../../../../common/EditAction";
import type {
  DocumentFormFieldValues,
  FormRef,
} from "../../../../../../AddEmployee/Document/Dialog/DocumentForm";
import { DocumentForm } from "../../../../../../AddEmployee/Document/Dialog/DocumentForm";
import { marshalDocumentPayload } from "../../../../../../AddEmployee/MarshalEmployeeData";
import type { Document } from "../DocumentList/hooks/useGetDocuments";
import { useEditDocument } from "./hooks/useEditDocument";
import { useGetDocument } from "./hooks/useGetDocument";
import { employeeBasicDetailsKeys } from "../../../../../../../../../queryKeysFactories/employee";
import { useQueryClient } from "@tanstack/react-query";
import { documentKeys } from "../../../../../../../../../queryKeysFactories/document";
import { useDisabledButtonsCache } from "../../../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../../../hooks/useEnableDisableButtonToggle";

type EditDocumentDialogProps = {
  open: boolean;
  document: Document;
  onEditSuccess: () => void;
  onClose: () => void;
  employeeId: string;
};

export const EditDocumentDialog = ({
  open,
  onClose,
  document,
  employeeId,
  onEditSuccess,
}: EditDocumentDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { data: latestDocumentData, isPending: isPendingLatestDocumentData } =
    useGetDocument({
      employeeId,
      documentId: document.id,
    });

  const { data: documentOptions } = useGetDocumentOptions({
    employeeId,
  });

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useEditDocument({
    employeeId,
    documentId: document.id,
    options: {
      onSuccess: (data) => {
        onClose();

        onEditSuccess();

        toasts.success({ title: data.message });

        queryClient.invalidateQueries({
          queryKey: documentKeys.listing({}),
        });

        queryClient.invalidateQueries({
          queryKey: employeeBasicDetailsKeys.get(employeeId),
        });
      },
      onError: (res) => {
        const { error, message } = res.response.data;

        const formattedError: DocumentFormFieldValues = {
          ...(error && typeof error["document_details"] === "object"
            ? error["document_details"]
            : {}),
          ...{},
        };

        const structuredError = {
          response: {
            data: {
              message,
              error: formattedError,
            },
          },
          status: res.status,
        };

        onError(structuredError, formRef.current?.setError);
      },
    },
  });

  const onEditDocument = () => {
    formRef.current?.submitForm((formValues) => {
      const documentPayload = marshalDocumentPayload([formValues]);

      if (documentPayload[0]) {
        mutate(documentPayload[0]);
      }
    });
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const defaultValues = useMemo(() => {
    if (latestDocumentData) {
      const documentSchemaFormFieldValues: DocumentFormFieldValues = {
        document_type: latestDocumentData.document_type ?? null,
        name: latestDocumentData.document_details.name ?? null,
        document_no: latestDocumentData.document_details.document_no ?? null,
        date_of_birth:
          latestDocumentData.document_details.date_of_birth ?? null,
        document_url: latestDocumentData.document_details.document_url ?? null,
        address: latestDocumentData.document_details.address ?? null,
        gender: latestDocumentData.document_details.gender ?? null,
        blood_group: latestDocumentData.document_details.blood_group ?? null,
        issue_date: latestDocumentData.document_details.issue_date ?? null,
        expiry_date: latestDocumentData.document_details.expiry_date ?? null,
        company_name: latestDocumentData.document_details.company_name ?? null,
        job_title: latestDocumentData.document_details.job_title ?? null,
        joining_date: latestDocumentData.document_details.joining_date ?? null,
        relieving_date:
          latestDocumentData.document_details.relieving_date ?? null,
        degree: latestDocumentData.document_details.degree ?? null,
        branch_name: latestDocumentData.document_details.branch_name ?? null,
        joining_year: latestDocumentData.document_details.joining_year ?? null,
        completion_year:
          latestDocumentData.document_details.completion_year ?? null,
        cgpa_or_percentage:
          latestDocumentData.document_details.cgpa_or_percentage ?? null,
        university_or_college:
          latestDocumentData.document_details.university_or_college ?? null,
      };

      return documentSchemaFormFieldValues;
    }
  }, [latestDocumentData]);

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

          <EditAction
            onClick={onEditDocument}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <DocumentForm
        ref={formRef}
        defaultValues={defaultValues}
        documentTypeOptions={documentOptions}
        loading={isPendingLatestDocumentData}
      />
    </Dialog>
  );
};

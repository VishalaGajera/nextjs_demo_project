import { FormRow, TextField } from "@codezee/sixtify-brahma";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FileUploadField } from "../../../../../common/FileUploadField";
import type { DocumentFormFieldValues } from "./DocumentForm";

type AddDocumentsFormProps = {
  disabled: boolean;
};

export const AddDocumentsForm = ({
  disabled = false,
}: AddDocumentsFormProps) => {
  const { t } = useTranslation();

  const {
    control,
    setError,
    formState: { errors, isLoading },
  } = useFormContext<DocumentFormFieldValues>();

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  return (
    <>
      <FormRow maxColumn={2}>
        <TextField
          name="name"
          control={control}
          disabled={disabled}
          label="Name As Per Doc"
          required
          loading={isLoading}
          error={!!errors.name}
          helperText={errorMessages(errors.name?.message)}
        />
      </FormRow>

      {!disabled && (
        <FileUploadField
          name="document_url"
          control={control}
          multiple
          setError={setError}
          label="File Upload"
          error={!!errors.document_url}
          helperText={errorMessages(errors.document_url?.message)}
        />
      )}
    </>
  );
};

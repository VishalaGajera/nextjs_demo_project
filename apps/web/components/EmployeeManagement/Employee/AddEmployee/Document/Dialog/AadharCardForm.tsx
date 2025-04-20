import { DatePicker, FormRow, TextField } from "@codezee/sixtify-brahma";
import { DateTime } from "luxon";
import type {
  Control,
  FieldErrors,
  FieldValues,
  UseFormSetError,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FileUploadField } from "../../../../../common/FileUploadField";
import type { DocumentFormFieldValues } from "./DocumentForm";

type AadharCardFormProps = {
  control: Control<FieldValues>;
  errors: FieldErrors<DocumentFormFieldValues>;
  setError: UseFormSetError<FieldValues>;
  loading: boolean;
  disabled: boolean;
};

export const AadharCardForm = (props: AadharCardFormProps) => {
  const { t } = useTranslation();

  const { control, errors, setError, loading, disabled = false } = props;

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
          loading={loading}
          error={!!errors.name}
          helperText={errorMessages(errors.name?.message)}
        />

        <TextField
          name="document_no"
          control={control}
          disabled={disabled}
          label="Aadhaar Card Number"
          required
          loading={loading}
          error={!!errors.document_no}
          helperText={errorMessages(errors.document_no?.message)}
        />
      </FormRow>

      <FormRow maxColumn={2}>
        <DatePicker
          setError={setError}
          name="date_of_birth"
          control={control}
          loading={loading}
          disabled={disabled}
          label="Date of Birth"
          maxDate={DateTime.now()}
          error={!!errors.date_of_birth}
          helperText={errorMessages(errors.date_of_birth?.message)}
        />

        <TextField
          name="address"
          loading={loading}
          control={control}
          disabled={disabled}
          label="Address"
        />
      </FormRow>

      {!disabled && (
        <FileUploadField
          name="document_url"
          control={control}
          label="File Upload"
          multiple
          setError={setError}
          error={!!errors.document_url}
          helperText={errorMessages(errors.document_url?.message)}
        />
      )}
    </>
  );
};

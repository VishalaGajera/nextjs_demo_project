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

type PanCardFormProps = {
  control: Control<FieldValues>;
  errors: FieldErrors<DocumentFormFieldValues>;
  setError: UseFormSetError<FieldValues>;
  loading?: boolean;
  disabled: boolean;
};

export const PanCardForm = (props: PanCardFormProps) => {
  const { control, errors, setError, loading, disabled = false } = props;

  const { t } = useTranslation();

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  return (
    <>
      <FormRow maxColumn={2}>
        <TextField
          name="name"
          control={control}
          label="Name As Per Doc"
          required
          loading={loading}
          disabled={disabled}
          error={!!errors.name}
          helperText={errorMessages(errors.name?.message)}
        />

        <TextField
          name="document_no"
          control={control}
          label="PAN No"
          required
          loading={loading}
          disabled={disabled}
          isCapitalize
          error={!!errors.document_no}
          helperText={errorMessages(errors.document_no?.message)}
        />
      </FormRow>

      <FormRow maxColumn={2}>
        <DatePicker
          setError={setError}
          loading={loading}
          disabled={disabled}
          name="date_of_birth"
          control={control}
          label="Date of Birth"
          maxDate={DateTime.now()}
          error={!!errors.date_of_birth}
          helperText={errorMessages(errors.date_of_birth?.message)}
        />

        <DatePicker
          setError={setError}
          name="issue_date"
          loading={loading}
          disabled={disabled}
          control={control}
          label="Issued Date"
          maxDate={DateTime.now()}
          error={!!errors.issue_date}
          helperText={errorMessages(errors.issue_date?.message)}
        />
      </FormRow>

      <FormRow maxColumn={2}>
        <TextField
          name="address"
          loading={loading}
          disabled={disabled}
          control={control}
          label="Address"
        />
      </FormRow>

      {!disabled && (
        <FileUploadField
          name="document_url"
          control={control}
          setError={setError}
          multiple
          label="File Upload"
          error={!!errors.document_url}
          helperText={errorMessages(errors.document_url?.message)}
        />
      )}
    </>
  );
};

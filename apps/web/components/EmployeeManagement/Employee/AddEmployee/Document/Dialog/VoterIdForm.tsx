import { DatePicker, FormRow, TextField } from "@codezee/sixtify-brahma";
import { DateTime } from "luxon";
import type {
  Control,
  FieldErrors,
  FieldValues,
  UseFormSetError,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { GenderAutocomplete } from "../../../../../common/Autocomplete/GenderAutoComplete";
import { FileUploadField } from "../../../../../common/FileUploadField";
import type { DocumentFormFieldValues } from "./DocumentForm";

type VoterIdFormProps = {
  control: Control<FieldValues>;
  errors: FieldErrors<DocumentFormFieldValues>;
  setError: UseFormSetError<FieldValues>;
  loading?: boolean;
  disabled: boolean;
};

export const VoterIdForm = (props: VoterIdFormProps) => {
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
          label="Voter Id"
          isCapitalize
          required
          loading={loading}
          disabled={disabled}
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

        <GenderAutocomplete
          name="gender"
          control={control}
          loading={loading}
          disabled={disabled}
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

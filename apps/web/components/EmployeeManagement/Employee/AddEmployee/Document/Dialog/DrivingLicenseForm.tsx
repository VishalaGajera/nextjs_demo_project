import { DatePicker, FormRow, TextField } from "@codezee/sixtify-brahma";
import { DateTime } from "luxon";
import type {
  Control,
  FieldErrors,
  FieldValues,
  UseFormSetError,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BloodGroupAutocomplete } from "../../../../../common/Autocomplete/BloodGroupAutocomplete";
import { FileUploadField } from "../../../../../common/FileUploadField";
import type { DocumentFormFieldValues } from "./DocumentForm";

type DrivingLicenseFormProps = {
  control: Control<FieldValues>;
  errors: FieldErrors<DocumentFormFieldValues>;
  setError: UseFormSetError<FieldValues>;
  loading?: boolean;
  disabled: boolean;
};

export const DrivingLicenseForm = (props: DrivingLicenseFormProps) => {
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
          label="License Number"
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

        <BloodGroupAutocomplete
          control={control}
          name="blood_group"
          loading={loading}
          disabled={disabled}
        />
      </FormRow>
      <FormRow maxColumn={2}>
        <DatePicker
          setError={setError}
          name="issue_date"
          control={control}
          label="Issue Date"
          required
          loading={loading}
          disabled={disabled}
          maxDate={DateTime.now()}
          error={!!errors.issue_date}
          helperText={errorMessages(errors.issue_date?.message)}
        />

        <DatePicker
          name="expiry_date"
          control={control}
          label="Expiry On"
          required
          loading={loading}
          disabled={disabled}
          error={!!errors.expiry_date}
          helperText={errorMessages(errors.expiry_date?.message)}
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

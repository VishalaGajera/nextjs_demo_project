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

type DegreeAndCertificateFormProps = {
  control: Control<FieldValues>;
  errors: FieldErrors<DocumentFormFieldValues>;
  setError: UseFormSetError<FieldValues>;
  loading?: boolean;
  disabled: boolean;
};

export const DegreeAndCertificateForm = (
  props: DegreeAndCertificateFormProps
) => {
  const { control, errors, setError, loading, disabled = false } = props;

  const { t } = useTranslation();

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  return (
    <>
      <FormRow maxColumn={2}>
        <TextField
          name="degree"
          control={control}
          label="Degree"
          required
          loading={loading}
          disabled={disabled}
          error={!!errors.degree}
          helperText={errorMessages(errors.degree?.message)}
        />

        <TextField
          name="branch_name"
          control={control}
          label="Branch/Specialization"
          required
          loading={loading}
          disabled={disabled}
          error={!!errors.branch_name}
          helperText={errorMessages(errors.branch_name?.message)}
        />
      </FormRow>

      <FormRow maxColumn={2}>
        <DatePicker
          setError={setError}
          name="joining_year"
          control={control}
          loading={loading}
          disabled={disabled}
          label="Year of Joining"
          maxDate={DateTime.now()}
          error={!!errors.joining_year}
          helperText={errorMessages(errors.joining_year?.message)}
        />

        <DatePicker
          name="completion_year"
          control={control}
          loading={loading}
          disabled={disabled}
          label="Year of Completion"
        />
      </FormRow>

      <FormRow maxColumn={2}>
        <TextField
          control={control}
          label="CGPA/Percentage"
          name="cgpa_or_percentage"
          type="number"
          loading={loading}
          disabled={disabled}
          error={!!errors.cgpa_or_percentage}
          helperText={errorMessages(errors.cgpa_or_percentage?.message)}
        />

        <TextField
          name="university_or_college"
          control={control}
          loading={loading}
          disabled={disabled}
          label="University/College"
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

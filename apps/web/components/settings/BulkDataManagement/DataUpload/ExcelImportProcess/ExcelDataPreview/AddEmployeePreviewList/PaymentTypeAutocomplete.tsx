import { Autocomplete, type Option } from "@codezee/sixtify-brahma";
import { useEffect } from "react";
import type {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  PathValue,
  UseFormClearErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { EMPLOYEE } from "../constant";

const BANK_RELATED_FIELDS = [
  "bank_id",
  "branch_name",
  "account_type",
  "account_no",
  "ifsc_code",
  "name_as_per_bank",
] as const;

type PaymentTypeAutocompleteProps<T extends FieldValues> = {
  fieldName: keyof T; // Dynamically infer the key from the provided type
  node: { rowIndex: number };
  control: Control<T>; // Dynamically handle the control for the form
  errors: FieldErrors<T>; // Dynamically handle the errors
  errorMessage: string;
  loading: boolean;
  disabled: boolean;
  options: Option[];
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  clearErrors: UseFormClearErrors<T>;
};

export const PaymentTypeAutocomplete = <T extends FieldValues>({
  node,
  errors,
  errorMessage,
  loading,
  fieldName,
  control,
  watch,
  options,
  setValue,
  clearErrors,
  disabled = false,
}: PaymentTypeAutocompleteProps<T>) => {
  const index = node.rowIndex ?? 0;

  const error = (
    (errors.employee as FieldErrors<T>)?.[index] as FieldErrors<T>
  )?.[fieldName];

  const key = `${EMPLOYEE}.${index}.${String(fieldName)}` as Path<T>;

  const value = watch(key);

  useEffect(() => {
    if (!value || value === "cash" || value === "cheque") {
      // Handle all bank-related fields
      BANK_RELATED_FIELDS.forEach((field) => {
        const fieldPath = `${EMPLOYEE}.${index}.${field}` as Path<T>;

        const currentValue = watch(fieldPath);

        const hasError = (
          (errors[EMPLOYEE] as FieldErrors<T>)?.[index] as FieldErrors<T>
        )?.[field];

        // Clear field value if it exists
        if (currentValue) {
          // Use appropriate default value based on field type
          const defaultValue =
            field === "bank_id" || field === "account_type" ? null : "";

          setValue(fieldPath, defaultValue as PathValue<T, Path<T>>, {
            shouldValidate: false,
          });
        }

        // Clear error if it exists
        if (hasError) {
          clearErrors(fieldPath);
        }
      });
    }
  }, [value, index, setValue, clearErrors, errors, watch]);

  return (
    <Autocomplete
      name={`${EMPLOYEE}.${index}.${String(fieldName)}` as Path<T>}
      loading={loading}
      placeholder="Select"
      options={options}
      control={control}
      error={!!error}
      disabled={disabled}
      helperText={errorMessage}
    />
  );
};

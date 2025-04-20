import { Autocomplete, type Option } from "@codezee/sixtify-brahma";
import { useMemo } from "react";
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

type EmployeeCodeTypeAutocompleteProps<T extends FieldValues> = {
  fieldName: keyof T; // Dynamically infer the key from the provided type
  node: { rowIndex: number };
  control: Control<T>; // Dynamically handle the control for the form
  errors: FieldErrors<T>; // Dynamically handle the errors
  errorMessage: string;
  options: Option[];
  loading: boolean;
  businessUnitId: string | null;
  disabled: boolean;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  clearErrors: UseFormClearErrors<T>;
};

export const EmployeeCodeTypeAutocomplete = <T extends FieldValues>({
  node,
  errors,
  errorMessage,
  loading,
  fieldName,
  options,
  control,
  watch,
  setValue,
  clearErrors,
  disabled = false,
}: EmployeeCodeTypeAutocompleteProps<T>) => {
  const index = node.rowIndex ?? 0;

  const error = (
    (errors[EMPLOYEE] as FieldErrors<T>)?.[index] as FieldErrors<T>
  )?.[fieldName];

  const key = `${EMPLOYEE}.${index}.${String(fieldName)}` as Path<T>;

  const value = watch(key);

  useMemo(() => {
    if (!value || value === "manual") {
      if (watch(`${EMPLOYEE}.${index}.employee_code_id` as Path<T>)) {
        setValue(
          `${EMPLOYEE}.${index}.employee_code_id` as Path<T>,
          null as PathValue<T, Path<T>>,
          {
            shouldValidate: false,
          }
        );
      }

      if (
        ((errors[EMPLOYEE] as FieldErrors<T>)?.[index] as FieldErrors<T>)
          ?.employee_code_id
      ) {
        clearErrors(`${EMPLOYEE}.${index}.employee_code_id` as Path<T>);
      }
    }

    if (!value || value === "auto") {
      if (watch(`${EMPLOYEE}.${index}.employee_code` as Path<T>)) {
        setValue(
          `${EMPLOYEE}.${index}.employee_code` as Path<T>,
          "" as PathValue<T, Path<T>>,
          {
            shouldValidate: false,
          }
        );
      }

      if (
        ((errors[EMPLOYEE] as FieldErrors<T>)?.[index] as FieldErrors<T>)
          ?.employee_code
      ) {
        clearErrors(`${EMPLOYEE}.${index}.employee_code` as Path<T>);
      }
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

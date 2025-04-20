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

type DepartmentAutocompleteProps<T extends FieldValues> = {
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

export const DepartmentAutocomplete = <T extends FieldValues>({
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
}: DepartmentAutocompleteProps<T>) => {
  const index = node.rowIndex ?? 0;

  const error = (
    (errors[EMPLOYEE] as FieldErrors<T>)?.[index] as FieldErrors<T>
  )?.[fieldName];

  const key = `${EMPLOYEE}.${index}.${String(fieldName)}` as Path<T>;

  const value = watch(key);

  useMemo(() => {
    if (!value) {
      if (watch(`${EMPLOYEE}.${index}.sub_department_id` as Path<T>)) {
        setValue(
          `${EMPLOYEE}.${index}.sub_department_id` as Path<T>,
          null as PathValue<T, Path<T>>
        );
      }

      if (
        ((errors[EMPLOYEE] as FieldErrors<T>)?.[index] as FieldErrors<T>)
          ?.sub_department_id
      ) {
        clearErrors(`${EMPLOYEE}.${index}.sub_department_id` as Path<T>);
      }
    }
  }, [value]);

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

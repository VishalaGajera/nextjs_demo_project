import { Autocomplete, type Option } from "@codezee/sixtify-brahma";
import { useEffect, useRef } from "react";
import type {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useGetSubDepartmentOptions } from "../../../../../../common/Autocomplete/hooks/useGetSubDepartmentOptions";
import { EMPLOYEE } from "../constant";

type SubDepartmentAutocompleteProps<T extends FieldValues> = {
  fieldName: keyof T; // Dynamically infer the key from the provided type
  node: { rowIndex: number };
  control: Control<T>; // Dynamically handle the control for the form
  error: FieldErrors<T>; // Dynamically handle the errors
  errorMessage: string;
  loading: boolean;
  disabled: boolean;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
};

export const SubDepartmentAutocomplete = <T extends FieldValues>({
  node,
  error,
  errorMessage,
  loading,
  fieldName,
  control,
  watch,
  setValue,
  disabled = false,
}: SubDepartmentAutocompleteProps<T>) => {
  const index = node.rowIndex ?? 0;

  const previousOptionsRef = useRef<Option[]>([]);

  const key = `${EMPLOYEE}.${index}.${String(fieldName)}` as Path<T>;

  const value = watch(key);

  const { data: subCategoryOptions } = useGetSubDepartmentOptions({
    departmentId: !loading
      ? watch(`${EMPLOYEE}.${index}.department_id` as Path<T>)
      : "",
  });

  useEffect(() => {
    // Skip if options haven't changed
    if (
      JSON.stringify(previousOptionsRef.current) ===
      JSON.stringify(subCategoryOptions)
    ) {
      return;
    }

    previousOptionsRef.current = subCategoryOptions;

    // Only update if we have both a value and options
    if (!value || !subCategoryOptions.length) {
      return;
    }

    // Find matching option and update form
    const matchingOption = subCategoryOptions.find(
      (option) => option.label === value
    );

    if (matchingOption) {
      setValue(key, matchingOption.value as PathValue<T, Path<T>>, {
        shouldValidate: true,
      });
    }
  }, [subCategoryOptions, setValue, value, key]);

  return (
    <Autocomplete
      name={`${EMPLOYEE}.${index}.${String(fieldName)}` as Path<T>}
      loading={loading}
      placeholder="Select"
      options={subCategoryOptions}
      control={control}
      error={!!error}
      disabled={disabled}
      helperText={errorMessage}
    />
  );
};

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
import { useGetLocationOptions } from "../../../../../../common/Autocomplete/hooks/useGetLocationOptions";
import { EMPLOYEE } from "../constant";

type LocationAutocompleteProps<T extends FieldValues> = {
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

export const LocationAutocomplete = <T extends FieldValues>({
  node,
  error,
  errorMessage,
  loading,
  fieldName,
  control,
  watch,
  setValue,
  disabled = false,
}: LocationAutocompleteProps<T>) => {
  const index = node.rowIndex ?? 0;

  const previousOptionsRef = useRef<Option[]>([]);

  const key = `${EMPLOYEE}.${index}.${String(fieldName)}` as Path<T>;

  const value = watch(key);

  const { data: locationOptions } = useGetLocationOptions({
    businessUnitId: !loading
      ? watch(`${EMPLOYEE}.${index}.business_unit_id` as Path<T>)
      : "",
  });

  useEffect(() => {
    // Skip if options haven't changed
    if (
      JSON.stringify(previousOptionsRef.current) ===
      JSON.stringify(locationOptions)
    ) {
      return;
    }

    previousOptionsRef.current = locationOptions;

    // Only update if we have both a value and options
    if (!value || !locationOptions.length) {
      return;
    }

    // Find matching option and update form
    const matchingOption = locationOptions.find(
      (option) => option.label === value
    );

    if (matchingOption) {
      setValue(key, matchingOption.value as PathValue<T, Path<T>>, {
        shouldValidate: true,
      });
    }
  }, [locationOptions, setValue, value, key]);

  return (
    <Autocomplete
      name={`${EMPLOYEE}.${index}.${String(fieldName)}` as Path<T>}
      loading={loading}
      placeholder="Select"
      options={locationOptions}
      control={control}
      error={!!error}
      disabled={disabled}
      helperText={errorMessage}
    />
  );
};

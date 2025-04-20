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
import { useGetCity } from "../../../../../../../hooks/useGetCity";
import { EMPLOYEE_ADDRESS_DETAILS } from "../constant";

type CityAutocompleteProps<T extends FieldValues> = {
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

export const CityAutocomplete = <T extends FieldValues>({
  node,
  error,
  errorMessage,
  loading,
  fieldName,
  control,
  watch,
  setValue,
  disabled = false,
}: CityAutocompleteProps<T>) => {
  const index = node.rowIndex ?? 0;

  const previousOptionsRef = useRef<Option[]>([]);

  const key =
    `${EMPLOYEE_ADDRESS_DETAILS}.${index}.${String(fieldName)}` as Path<T>;

  const value = watch(key);

  const { data: cityOptions = [] } = useGetCity({
    stateId: !loading
      ? watch(`${EMPLOYEE_ADDRESS_DETAILS}.${index}.state_id` as Path<T>)
      : "",
  });

  useEffect(() => {
    // Skip if options haven't changed
    if (
      JSON.stringify(previousOptionsRef.current) === JSON.stringify(cityOptions)
    ) {
      return;
    }

    previousOptionsRef.current = cityOptions;

    // Only update if we have both a value and options
    if (!value || !cityOptions.length) {
      return;
    }

    // Find matching option and update form
    const matchingOption = cityOptions.find((option) => option.label === value);

    if (matchingOption) {
      setValue(key, matchingOption.value as PathValue<T, Path<T>>, {
        shouldValidate: true,
      });
    }
  }, [cityOptions, setValue, value, key]);

  return (
    <Autocomplete
      name={
        `${EMPLOYEE_ADDRESS_DETAILS}.${index}.${String(fieldName)}` as Path<T>
      }
      loading={loading}
      placeholder="Select"
      options={cityOptions}
      control={control}
      error={!!error}
      disabled={disabled}
      helperText={errorMessage}
    />
  );
};

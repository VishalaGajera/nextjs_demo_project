import { Autocomplete, type Option } from "@codezee/sixtify-brahma";
import type { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import type { MasterCodeOptionValues } from "../constant";

type AutocompleteCellRendererProps<T extends FieldValues> = {
  fieldName: keyof T; // Dynamically infer the key from the provided type
  node: { rowIndex: number };
  control: Control<T>; // Dynamically handle the control for the form
  error: FieldErrors<T>; // Dynamically handle the errors
  errorMessage: string;
  loading: boolean;
  options: Option[];
  disabled: boolean;
  masterCodeKey: MasterCodeOptionValues;
};

export const AutocompleteCellRenderer = <T extends FieldValues>({
  node,
  error,
  errorMessage,
  loading,
  fieldName,
  options = [],
  control,
  disabled = false,
  masterCodeKey,
}: AutocompleteCellRendererProps<T>) => {
  const index = node.rowIndex ?? 0;

  return (
    <Autocomplete
      name={`${masterCodeKey}.${index}.${String(fieldName)}` as Path<T>}
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

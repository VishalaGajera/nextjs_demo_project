import { TextField } from "@codezee/sixtify-brahma";
import type { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import type { MasterCodeOptionValues } from "../constant";

type TextCellRendererProps<T extends FieldValues> = {
  fieldName: keyof T; // Dynamically infer the key from the provided type
  node: { rowIndex: number };
  control: Control<T>; // Dynamically handle the control for the form
  error: FieldErrors<T>; // Dynamically handle the errors
  errorMessage: string;
  loading: boolean;
  disabled?: boolean;
  masterCodeKey: MasterCodeOptionValues;
};

export const TextCellRenderer = <T extends FieldValues>({
  node,
  control,
  error,
  errorMessage,
  loading,
  fieldName,
  disabled = false,
  masterCodeKey,
}: TextCellRendererProps<T>) => {
  const index = node.rowIndex ?? 0;

  return (
    <TextField
      name={`${masterCodeKey}.${index}.${String(fieldName)}` as Path<T>}
      control={control}
      required
      key={`${masterCodeKey}.${index}.${String(fieldName)}`}
      loading={loading}
      error={!!error}
      disabled={disabled}
      helperText={errorMessage}
    />
  );
};

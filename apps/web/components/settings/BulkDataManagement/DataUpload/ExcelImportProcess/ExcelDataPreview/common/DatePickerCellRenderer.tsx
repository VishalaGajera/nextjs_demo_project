import { DatePicker } from "@codezee/sixtify-brahma";
import type { DateTime } from "luxon";
import type {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  UseFormSetError,
} from "react-hook-form";
import type { MasterCodeOptionValues } from "../constant";

type DatePickerCellRendererProps<T extends FieldValues> = {
  fieldName: keyof T; // Dynamically infer the key from the provided type
  node: { rowIndex: number };
  control: Control<T>; // Dynamically handle the control for the form
  error: FieldErrors<T>; // Dynamically handle the errors
  errorMessage: string;
  loading: boolean;
  maxDate: DateTime<boolean>;
  minDate: DateTime<boolean>;
  setError: UseFormSetError<T>;
  masterCodeKey: MasterCodeOptionValues;
};

export const DatePickerCellRenderer = <T extends FieldValues>({
  node,
  error,
  errorMessage,
  loading,
  fieldName,
  setError,
  control,
  maxDate,
  minDate,
  masterCodeKey,
}: DatePickerCellRendererProps<T>) => {
  const index = node.rowIndex ?? 0;

  return (
    <DatePicker
      name={`${masterCodeKey}.${index}.${String(fieldName)}` as Path<T>}
      setError={(name, error) => setError(name as Path<T>, error)}
      control={control}
      loading={loading}
      maxDate={maxDate}
      minDate={minDate}
      required
      error={!!error}
      helperText={errorMessage}
    />
  );
};

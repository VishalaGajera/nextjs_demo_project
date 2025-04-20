import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useWeekDaysOptions } from "./hooks/useWeekDaysOptions";

type BankWeeklyOffAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
>;

export const BankWeeklyOffAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: BankWeeklyOffAutocompleteProps<P>) => {
  const { weekDaysOptions } = useWeekDaysOptions();

  return (
    <Autocomplete
      label="Bank Weekly Off"
      options={weekDaysOptions}
      placeholder="Select Weekly Off"
      loading={loading}
      {...props}
    />
  );
};

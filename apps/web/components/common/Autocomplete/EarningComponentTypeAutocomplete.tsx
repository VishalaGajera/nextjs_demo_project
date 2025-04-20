import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetEarningComponentTypeOptions } from "./hooks/useGetEarningComponentTypeOptions";

type EarningComponentTypeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
>;

export const EarningComponentTypeAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: EarningComponentTypeAutocompleteProps<P>) => {
  const { earningComponentTypeOption } = useGetEarningComponentTypeOptions();

  return (
    <Autocomplete
      label="Earning Component Type"
      options={earningComponentTypeOption}
      placeholder="Earning Type"
      loading={loading}
      {...props}
    />
  );
};

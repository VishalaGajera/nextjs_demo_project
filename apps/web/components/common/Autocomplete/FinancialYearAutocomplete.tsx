import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetFinancialYearOptions } from "./hooks/useGetFinancialYearOptions";

type FinancialYearAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const FinancialYearAutocomplete = <P extends FieldValues>(
  props: FinancialYearAutocompleteProps<P>
) => {
  const financialYears = useGetFinancialYearOptions(2023, 30);

  return (
    <Autocomplete
      label="Financial Year"
      options={financialYears}
      placeholder="Select Financial Year"
      {...props}
    />
  );
};

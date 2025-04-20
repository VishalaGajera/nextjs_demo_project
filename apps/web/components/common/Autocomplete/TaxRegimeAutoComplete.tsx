import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetTaxRegimeOptions } from "./hooks/useGetTaxRegimeOptions";

type TaxRegimeAutoCompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const TaxRegimeAutoComplete = <P extends FieldValues>(
  props: TaxRegimeAutoCompleteProps<P>
) => {
  const { data: options } = useGetTaxRegimeOptions();

  return (
    <Autocomplete
      label="Tax Regime"
      options={options}
      placeholder="Select Tax Regime"
      {...props}
    />
  );
};

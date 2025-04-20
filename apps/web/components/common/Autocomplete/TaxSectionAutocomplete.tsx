import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetTaxSectionOptions } from "./hooks/useGetTaxSectionOptions";

type TaxSectionAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const TaxSectionAutocomplete = <P extends FieldValues>(
  props: TaxSectionAutocompleteProps<P>
) => {
  const { data: taxSectionOptions } = useGetTaxSectionOptions();

  return (
    <Autocomplete
      label="Tax Section Code"
      options={taxSectionOptions}
      placeholder="Select Tax Section"
      {...props}
    />
  );
};

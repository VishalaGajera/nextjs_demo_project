import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetRegimeOptions } from "./hooks/useGetRegimeOptions";

type RegimeTypeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const RegimeTypeAutocomplete = <P extends FieldValues>(
  props: RegimeTypeAutocompleteProps<P>
) => {
  const { regimeOptions } = useGetRegimeOptions();

  return (
    <Autocomplete
      label="Regime Type"
      options={regimeOptions}
      placeholder="Select Regime"
      {...props}
    />
  );
};

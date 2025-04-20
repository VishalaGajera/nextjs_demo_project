import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetCountry } from "../../../hooks/useGetCountry";

type CountryAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const CountryAutocomplete = <P extends FieldValues>(
  props: CountryAutocompleteProps<P>
) => {
  const { data: countryOptions = [] } = useGetCountry();

  return (
    <Autocomplete
      label="Country"
      options={countryOptions}
      placeholder="Select Country"
      {...props}
    />
  );
};

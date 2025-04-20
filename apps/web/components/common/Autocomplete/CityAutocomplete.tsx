import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetCity } from "../../../hooks/useGetCity";

type CityAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  stateId: string | null;
};

export const CityAutocomplete = <P extends FieldValues>({
  stateId,
  ...props
}: CityAutocompleteProps<P>) => {
  const { data: cityOptions = [] } = useGetCity({
    stateId,
  });

  return (
    <Autocomplete
      label="City"
      options={cityOptions}
      placeholder="Select City"
      {...props}
    />
  );
};

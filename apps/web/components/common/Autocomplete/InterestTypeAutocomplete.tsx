import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetInsterestOptions } from "./hooks/useGetInterestOptions";

type InterestTypeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const InterestTypeAutocomplete = <P extends FieldValues>({
  ...props
}: InterestTypeAutocompleteProps<P>) => {
  const { interestOptions } = useGetInsterestOptions();

  return (
    <Autocomplete
      label="Type of Interest"
      options={interestOptions}
      placeholder="Select Type of Interest"
      {...props}
    />
  );
};

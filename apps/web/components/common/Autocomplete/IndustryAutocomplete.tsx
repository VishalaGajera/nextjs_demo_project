import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetIndustryOptions } from "./hooks/useGetIndustryOptions";

type IndustryAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const IndustryAutocomplete = <P extends FieldValues>(
  props: IndustryAutocompleteProps<P>
) => {
  const { data: industryOptions } = useGetIndustryOptions();

  return (
    <Autocomplete
      label="Industry"
      options={industryOptions}
      placeholder="Select Industry"
      {...props}
    />
  );
};

import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetPatternTypeOptions } from "./hooks/useGetPatternTypeOptions";

type PatternTypeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  hideLabel?: boolean;
};

export const PatternTypeAutocomplete = <P extends FieldValues>({
  hideLabel = false,
  ...props
}: PatternTypeAutocompleteProps<P>) => {
  const { patternTypeOptions } = useGetPatternTypeOptions();

  return (
    <Autocomplete
      label={hideLabel ? "" : "Select Pattern Type"}
      options={patternTypeOptions}
      {...props}
    />
  );
};

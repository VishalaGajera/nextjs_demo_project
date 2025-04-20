import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetPatternRepeatOptions } from "./hooks/useGetPatternRepeatOptions";

type PatternRepeatAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  hideLabel?: boolean;
};

export const PatternRepeatAutocomplete = <P extends FieldValues>({
  hideLabel = false,
  ...props
}: PatternRepeatAutocompleteProps<P>) => {
  const { patternRepeatOptions } = useGetPatternRepeatOptions();

  return (
    <Autocomplete
      label={hideLabel ? "" : "Select Pattern Repeat"}
      options={patternRepeatOptions}
      {...props}
    />
  );
};

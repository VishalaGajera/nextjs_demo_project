import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetDurationOptions } from "./hooks/useGetDurationOptions";

type DurationAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  hideLabel?: boolean;
};

export const DurationAutocomplete = <P extends FieldValues>({
  hideLabel = false,
  ...props
}: DurationAutocompleteProps<P>) => {
  const { durationOptions } = useGetDurationOptions();

  return (
    <Autocomplete
      label={hideLabel ? "" : "Select Duration"}
      options={durationOptions}
      placeholder="Select Duration"
      {...props}
    />
  );
};

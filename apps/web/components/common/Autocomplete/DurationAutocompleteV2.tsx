import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetDurationsOptions } from "./hooks/useGetDurationsOptions";

type DurationAutocompletePropsV2<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  hideLabel?: boolean;
};

export const DurationAutocompleteV2 = <P extends FieldValues>({
  hideLabel = false,
  ...props
}: DurationAutocompletePropsV2<P>) => {
  const { durationsOption } = useGetDurationsOptions();

  return (
    <Autocomplete
      label={hideLabel ? "" : "Select Duration"}
      options={durationsOption}
      placeholder="Select Duration"
      {...props}
    />
  );
};

import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetDurationsV3Options } from "./hooks/useGetDurationsV3Options";

type ProfessionalTaxDurationAutoCompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  hideLabel?: boolean;
};

export const DurationAutoCompleteV3 = <P extends FieldValues>({
  hideLabel = false,
  ...props
}: ProfessionalTaxDurationAutoCompleteProps<P>) => {
  const { durationOptions } = useGetDurationsV3Options();

  return (
    <Autocomplete
      label={hideLabel ? "" : "Select Duration"}
      options={durationOptions}
      placeholder="Select Duration"
      {...props}
    />
  );
};

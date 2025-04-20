import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetCurrentDateOptions } from "./hooks/useGetCurrentDateOptions";

type CurrentDateAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const CurrentDateAutocomplete = <P extends FieldValues>({
  ...props
}: CurrentDateAutocompleteProps<P>) => {
  const { currentDateOption } = useGetCurrentDateOptions();

  return (
    <Autocomplete
      label="Year"
      options={currentDateOption}
      placeholder="Select Year"
      {...props}
    />
  );
};

import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetCustomDaysOptions } from "./hooks/useGetCustomDaysOptions";

type CustomDayAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const CustomDayAutoComplete = <P extends FieldValues>({
  ...props
}: CustomDayAutocompleteProps<P>) => {
  const { customDaysOption } = useGetCustomDaysOptions();

  return (
    <Autocomplete
      options={customDaysOption}
      placeholder="Select Day"
      {...props}
    />
  );
};

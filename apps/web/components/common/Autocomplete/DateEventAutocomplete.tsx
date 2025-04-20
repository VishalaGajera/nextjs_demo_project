import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetDateEventsOptions } from "./hooks/useGetDateEventsOptions";

type DateEventAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const DateEventAutocomplete = <P extends FieldValues>({
  ...props
}: DateEventAutocompleteProps<P>) => {
  const { dateEventOptions } = useGetDateEventsOptions();

  return (
    <Autocomplete
      options={dateEventOptions}
      placeholder="Select Day"
      {...props}
    />
  );
};

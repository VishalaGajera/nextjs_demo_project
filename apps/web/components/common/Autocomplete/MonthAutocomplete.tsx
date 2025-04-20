import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetMonthOptions } from "./hooks/useGetMonthOptions";

type MonthAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const MonthAutocomplete = <P extends FieldValues>(
  props: MonthAutocompleteProps<P>
) => {
  const { monthOptions } = useGetMonthOptions();

  return (
    <Autocomplete
      label="Select Month"
      options={monthOptions}
      placeholder="Select Month"
      {...props}
    />
  );
};

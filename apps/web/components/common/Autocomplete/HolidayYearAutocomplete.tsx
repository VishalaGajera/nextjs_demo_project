import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetHolidayYear } from "./hooks/useGetHolidayYearsOptions";
type HolidayYearAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const HolidayYearAutocomplete = <P extends FieldValues>(
  props: HolidayYearAutocompleteProps<P>
) => {
  const { data: yearOptions, isLoading } = useGetHolidayYear();

  return (
    <Autocomplete
      loading={isLoading}
      options={yearOptions}
      placeholder="Year"
      {...props}
    />
  );
};

import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetWeeklyOffOptions } from "./hooks/useGetWeeklyOffOptions";

type WeeklyOffAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
>;

export const WeeklyOffAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: WeeklyOffAutocompleteProps<P>) => {
  const { weeklyOffOption } = useGetWeeklyOffOptions();

  return (
    <Autocomplete
      options={weeklyOffOption}
      placeholder="Working Day"
      loading={loading}
      {...props}
    />
  );
};

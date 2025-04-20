import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetWeeklyOffSchemaOptions } from "./hooks/useGetWeeklyOffSchemaOptions";

type WeeklyOffSchemeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  companyId?: string | null;
};

export const WeeklyOffSchemeAutocomplete = <P extends FieldValues>({
  companyId,
  ...props
}: WeeklyOffSchemeAutocompleteProps<P>) => {
  const { data: weeklyOffSchemeOptions } = useGetWeeklyOffSchemaOptions({
    companyId,
  });

  return (
    <Autocomplete
      label="Weekly Off"
      options={weeklyOffSchemeOptions}
      placeholder="Select Weekly Off"
      {...props}
    />
  );
};

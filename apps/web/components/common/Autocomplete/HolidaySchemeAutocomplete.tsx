import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetHolidaySchemaOptions } from "./hooks/useGetHolidaySchemaOptions";

type HolidaySchemeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  companyId: string;
};

export const HolidaySchemeAutocomplete = <P extends FieldValues>({
  companyId,
  ...props
}: HolidaySchemeAutocompleteProps<P>) => {
  const { data: holidaySchemeOptions } = useGetHolidaySchemaOptions({
    companyId,
  });

  return (
    <Autocomplete
      label="Holiday"
      options={holidaySchemeOptions}
      placeholder="Select Holiday"
      {...props}
    />
  );
};

// NationalityAutocomplete.tsx

import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetReligionOption } from "./hooks/useGetReligionOptions";

type ReligionAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
>;

export const ReligionAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: ReligionAutocompleteProps<P>) => {
  const { religionOption } = useGetReligionOption();

  return (
    <Autocomplete
      label="Religion"
      options={religionOption}
      placeholder="Select Religion"
      loading={loading}
      {...props}
    />
  );
};

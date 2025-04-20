import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetGenderOptions } from "./hooks/useGetGenderOptions";

type GenderAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
  hideLabel?: boolean;
};

export const GenderAutocomplete = <P extends FieldValues>({
  loading = false,
  hideLabel = false,
  ...props
}: GenderAutocompleteProps<P>) => {
  const { genderOptions } = useGetGenderOptions();

  return (
    <Autocomplete
      label={hideLabel ? "" : "Gender"}
      options={genderOptions}
      placeholder="Select Gender"
      loading={loading}
      {...props}
    />
  );
};

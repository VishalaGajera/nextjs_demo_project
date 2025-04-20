import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetMaritalStatusOption } from "./hooks/useGetMaritalStatusOption";

type MaritalStatusAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
  hideLabel?: boolean;
};

export const MaritalStatusAutocomplete = <P extends FieldValues>({
  loading,
  hideLabel = false,
  ...props
}: MaritalStatusAutocompleteProps<P>) => {
  const { maritalStatusOption } = useGetMaritalStatusOption();

  return (
    <Autocomplete
      label={hideLabel ? "" : "Marital Status"}
      options={maritalStatusOption}
      placeholder="Select Marital Status"
      loading={loading}
      {...props}
    />
  );
};

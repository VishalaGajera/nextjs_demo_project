import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetCastOptions } from "./hooks/useGetCastOptions";

type SubCasteAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
>;

export const CastAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: SubCasteAutocompleteProps<P>) => {
  const { casteOption } = useGetCastOptions();

  return (
    <Autocomplete
      label="Caste"
      options={casteOption}
      placeholder="Select Caste"
      loading={loading}
      {...props}
    />
  );
};

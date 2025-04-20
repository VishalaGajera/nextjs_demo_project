import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetLocationOptions } from "./hooks/useGetLocationOptions";
type LocationAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  businessUnitId?: string | null;
};

export const LocationAutocomplete = <P extends FieldValues>({
  businessUnitId,
  loading,
  ...props
}: LocationAutocompleteProps<P>) => {
  const { data: locationOption } = useGetLocationOptions({
    businessUnitId,
  });

  return (
    <Autocomplete
      label="Location"
      loading={loading}
      options={locationOption}
      placeholder="Select Location"
      {...props}
    />
  );
};

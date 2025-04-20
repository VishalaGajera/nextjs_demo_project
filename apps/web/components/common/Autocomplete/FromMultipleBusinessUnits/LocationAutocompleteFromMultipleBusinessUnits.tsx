import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetLocationOptionsFromMultipleBusinessUnits } from "./hooks/useGetLocationOptionsFromMultipleBusinessUnits";

type LocationAutocompleteFromMultipleBusinessUnitsProps<P extends FieldValues> =
  Omit<AutocompleteProps<P>, "options"> & {
    businessUnitIds: string[];
  };

export const LocationAutocompleteFromMultipleBusinessUnits = <
  P extends FieldValues,
>({
  businessUnitIds,
  loading,
  ...props
}: LocationAutocompleteFromMultipleBusinessUnitsProps<P>) => {
  const { data: businessUnitOptions } =
    useGetLocationOptionsFromMultipleBusinessUnits({
      businessUnitIds,
    });

  return (
    <Autocomplete
      label="Locations"
      loading={loading}
      options={businessUnitOptions}
      placeholder="Select Locations"
      {...props}
    />
  );
};

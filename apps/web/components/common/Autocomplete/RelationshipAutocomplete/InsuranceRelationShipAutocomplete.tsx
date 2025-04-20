import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetInsuranceRelationTypesOptions } from "../hooks/useGetRelationShip/useGetInsuranceRelationshipOptions";

type InsuranceRelationShipAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
};

export const InsuranceRelationShipAutocomplete = <P extends FieldValues>({
  loading,

  ...props
}: InsuranceRelationShipAutocompleteProps<P>) => {
  const { insuranceRelationTypesOptions } =
    useGetInsuranceRelationTypesOptions();

  return (
    <Autocomplete
      label="Relationship"
      options={insuranceRelationTypesOptions}
      placeholder="Select Relationship"
      loading={loading}
      {...props}
    />
  );
};

import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetEmergencyRelationshipOptions } from "../hooks/useGetRelationShip/useGetEmergencyRelationshipOptions";

type EmergencyRelationAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
};

export const EmergencyRelationAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: EmergencyRelationAutocompleteProps<P>) => {
  const { emergencyRelationOption } = useGetEmergencyRelationshipOptions();

  return (
    <Autocomplete
      label="Relationship"
      options={emergencyRelationOption}
      placeholder="Select Relationship"
      loading={loading}
      {...props}
    />
  );
};

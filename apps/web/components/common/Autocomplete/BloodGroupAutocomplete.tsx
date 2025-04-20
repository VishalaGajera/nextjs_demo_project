import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetBloodGroupOptions } from "./hooks/useGetBloodGroupOption";

type BloodGroupAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
>;

export const BloodGroupAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: BloodGroupAutocompleteProps<P>) => {
  const { bloodGroupOptions } = useGetBloodGroupOptions();

  return (
    <Autocomplete
      label="Blood Group"
      options={bloodGroupOptions}
      placeholder="Select Blood Group"
      loading={loading}
      {...props}
    />
  );
};

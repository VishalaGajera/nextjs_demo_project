import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetInsuranceTypeOptions } from "./hooks/useGetInsuranceTypeOptions";

type InsuranceTypeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
>;

export const InsuranceTypeAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: InsuranceTypeAutocompleteProps<P>) => {
  const { insuranceTypeOptions } = useGetInsuranceTypeOptions();

  return (
    <Autocomplete
      label="Insurance Type"
      options={insuranceTypeOptions}
      placeholder="Select Insurance Type"
      loading={loading}
      {...props}
    />
  );
};

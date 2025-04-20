import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetBusinessUnitOptions } from "./hooks/useGetBusinessUnitOptions";

type BusinessUnitAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  companyId?: string | null;
  isEnabled?: boolean;
};

export const BusinessUnitAutocomplete = <P extends FieldValues>({
  companyId,
  isEnabled,
  loading,
  ...props
}: BusinessUnitAutocompleteProps<P>) => {
  const { data: businessUnitOptions } = useGetBusinessUnitOptions({
    companyId,
    isEnabled,
  });

  return (
    <Autocomplete
      label="Business Unit"
      loading={loading}
      options={businessUnitOptions}
      placeholder="Select Business Unit"
      {...props}
    />
  );
};

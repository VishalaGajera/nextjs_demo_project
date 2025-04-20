import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetBusinessUnitOptionsFromMultipleCompanies } from "./hooks/useGetBusinessUnitOptionsFromMultipleCompanies";

type BusinessUnitAutocompleteFromMultipleCompaniesProps<P extends FieldValues> =
  Omit<AutocompleteProps<P>, "options"> & {
    companyIds: string[];
  };

export const BusinessUnitAutocompleteFromMultipleCompanies = <
  P extends FieldValues,
>({
  companyIds,
  loading,
  ...props
}: BusinessUnitAutocompleteFromMultipleCompaniesProps<P>) => {
  const { data: businessUnitOptions } =
    useGetBusinessUnitOptionsFromMultipleCompanies({
      companyIds,
    });

  return (
    <Autocomplete
      label="Business Units"
      loading={loading}
      options={businessUnitOptions}
      placeholder="Select Business Units"
      {...props}
    />
  );
};

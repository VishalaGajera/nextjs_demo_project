import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetDepartmentOptionsFromMultipleCompanies } from "./hooks/useGetDepartmentOptionsFromMultipleCompanies";

type DepartmentAutocompleteFromMultipleCompaniesProps<P extends FieldValues> =
  Omit<AutocompleteProps<P>, "options"> & {
    companyIds: string[];
  };

export const DepartmentAutocompleteFromMultipleCompanies = <
  P extends FieldValues,
>({
  companyIds,
  loading,
  ...props
}: DepartmentAutocompleteFromMultipleCompaniesProps<P>) => {
  const { data: businessUnitOptions } =
    useGetDepartmentOptionsFromMultipleCompanies({
      companyIds,
    });

  return (
    <Autocomplete
      label="Departments"
      loading={loading}
      options={businessUnitOptions}
      placeholder="Select Departments"
      {...props}
    />
  );
};

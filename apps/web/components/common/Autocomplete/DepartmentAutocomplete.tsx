import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetDepartmentOptions } from "./hooks/useGetDepartmentOptions";

type DepartmentAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  companyId?: string | null;
};

export const DepartmentAutocomplete = <P extends FieldValues>({
  companyId,
  ...props
}: DepartmentAutocompleteProps<P>) => {
  const { data: departmentOptions } = useGetDepartmentOptions({
    companyId,
  });

  return (
    <Autocomplete
      label="Department"
      options={departmentOptions}
      placeholder="Select Department"
      {...props}
    />
  );
};

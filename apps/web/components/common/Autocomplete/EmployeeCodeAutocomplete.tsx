import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetEmployeeCodeOptions } from "./hooks/useGetEmployeeCodeOptions";
type EmployeeCodeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  companyId?: string | null;
};

export const EmployeeCodeAutocomplete = <P extends FieldValues>({
  companyId,
  ...props
}: EmployeeCodeAutocompleteProps<P>) => {
  const { data: employeeCodeOptions } = useGetEmployeeCodeOptions({
    companyId,
  });

  return (
    <Autocomplete
      label="Employee Code Selection"
      options={employeeCodeOptions}
      placeholder="Select Employee Code"
      {...props}
    />
  );
};

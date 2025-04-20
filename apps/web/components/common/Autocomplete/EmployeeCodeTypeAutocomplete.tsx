import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetEmployeeCodeTypeOptions } from "./hooks/useGetEmployeeCodeTypeOptions";

type EmployeeCodeTypeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
  label?: string;
};

export const EmployeeCodeTypeAutocomplete = <P extends FieldValues>({
  loading = false,
  label,
  ...props
}: EmployeeCodeTypeAutocompleteProps<P>) => {
  const { employeeCodeTypeOptions } = useGetEmployeeCodeTypeOptions();

  return (
    <Autocomplete
      label={label}
      options={employeeCodeTypeOptions}
      loading={loading}
      {...props}
    />
  );
};

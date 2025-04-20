import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetLoanPolicyEmployeeOption } from "./hooks/useGetLoanPolicyEmployeeOptions";

type EmployeeWithLoanPolicyAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  companyId: string;
};

export const EmployeeWithLoanPolicyAutocomplete = <P extends FieldValues>({
  companyId,
  ...props
}: EmployeeWithLoanPolicyAutocompleteProps<P>) => {
  const { data: employeeOptions } = useGetLoanPolicyEmployeeOption({
    companyId,
  });

  return (
    <Autocomplete
      label="Employee"
      options={employeeOptions}
      placeholder="Employee"
      {...props}
    />
  );
};

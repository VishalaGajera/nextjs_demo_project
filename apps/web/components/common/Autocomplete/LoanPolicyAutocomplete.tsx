import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetLoanPolicyOptions } from "./hooks/useGetLoanPolicyOptions";

type LoanPolicyAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  companyId: string;
};

export const LoanPolicyAutocomplete = <P extends FieldValues>({
  companyId,
  ...props
}: LoanPolicyAutocompleteProps<P>) => {
  const { data: loanPolicyOptions } = useGetLoanPolicyOptions({
    companyId,
  });

  return (
    <Autocomplete
      label="Loan Policy"
      options={loanPolicyOptions}
      placeholder="Select Loan Policy"
      {...props}
    />
  );
};

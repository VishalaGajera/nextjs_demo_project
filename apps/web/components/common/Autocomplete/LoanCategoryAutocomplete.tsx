import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetLoanCategoryOptions } from "./hooks/useGetLoanCategoryOptions";

type LoanCategoryAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const LoanCategoryAutocomplete = <P extends FieldValues>({
  ...props
}: LoanCategoryAutocompleteProps<P>) => {
  const { data: LoanCategoryOptions } = useGetLoanCategoryOptions();

  return (
    <Autocomplete
      label="Loan Category"
      options={LoanCategoryOptions}
      placeholder="Select Loan Category"
      {...props}
    />
  );
};

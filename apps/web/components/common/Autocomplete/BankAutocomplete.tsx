import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetBankOptions } from "./hooks/useGetBankOptions";

type BankAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const BankAutocomplete = <P extends FieldValues>(
  props: BankAutocompleteProps<P>
) => {
  const { data: bankOptions } = useGetBankOptions();

  return (
    <Autocomplete
      label="Bank Name"
      options={bankOptions}
      placeholder="Select Bank"
      {...props}
    />
  );
};

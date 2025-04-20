import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

type GuarantorAutocompleteProps<P extends FieldValues> = AutocompleteProps<P>;

export const GuarantorAutocomplete = <P extends FieldValues>({
  options,
  ...props
}: GuarantorAutocompleteProps<P>) => {
  return (
    <Autocomplete
      label="Guarantor"
      options={options}
      isShowAvatar
      isShowSelectAll={false}
      {...props}
    />
  );
};

import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetDeductionComponentOptions } from "./hooks/useGetDeductionComponentOptions";

type DeductionComponentAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;
export const DeductionComponentAutocomplete = <P extends FieldValues>({
  ...props
}: DeductionComponentAutocompleteProps<P>) => {
  const { deductionComponentOption } = useGetDeductionComponentOptions();

  return (
    <Autocomplete
      label="Deduction Component Type"
      options={deductionComponentOption}
      placeholder="Select Deduction Component"
      {...props}
    />
  );
};

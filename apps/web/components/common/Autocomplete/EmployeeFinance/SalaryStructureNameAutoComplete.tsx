import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import type { OptionsType } from "../../../../types/options";

type SalaryStructureNameAutoCompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  options: OptionsType[];
};

export const SalaryStructureNameAutoComplete = <P extends FieldValues>({
  options,
  ...props
}: SalaryStructureNameAutoCompleteProps<P>) => {
  return (
    <Autocomplete
      label="Salary Structure Name"
      options={options}
      placeholder="Select Name"
      {...props}
    />
  );
};

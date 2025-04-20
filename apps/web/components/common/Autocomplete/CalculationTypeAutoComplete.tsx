"use client";

import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { type OptionsType } from "../../../types/options";

type CalculationTypeAutoCompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  options: OptionsType[];
};
export const CalculationTypeAutoComplete = <P extends FieldValues>({
  options,
  ...props
}: CalculationTypeAutoCompleteProps<P>) => {
  return (
    <Autocomplete
      placeholder="Select Calculation Type"
      {...props}
      options={options}
    />
  );
};

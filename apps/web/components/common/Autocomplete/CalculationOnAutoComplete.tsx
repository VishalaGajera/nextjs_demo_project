"use client";

import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { type OptionsType } from "../../../types/options";

type CalculationOnAutoCompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  options: OptionsType[];
};
export const CalculationOnAutoComplete = <P extends FieldValues>({
  options,
  ...props
}: CalculationOnAutoCompleteProps<P>) => {
  return (
    <Autocomplete
      options={options}
      placeholder="Select Calculation On"
      {...props}
    />
  );
};

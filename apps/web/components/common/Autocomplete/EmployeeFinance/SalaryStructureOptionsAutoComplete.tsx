import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { useMemo } from "react";
import type { FieldValues } from "react-hook-form";
import type {
  SalaryStructureCategory,
  SalaryStructureDataItem,
  SalaryStructureOptions,
} from "./Hooks/useGetSalaryStructureOptions";
import { getDynamicOptions } from "./utils/getDynamicOptions";

export type OptionsType = "structure_by" | "structure_type" | "structure_name";

type SalaryStructureOptionsAutoCompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  optionType: OptionsType;
  structure_by?: keyof SalaryStructureOptions;
  structure_type?: keyof SalaryStructureCategory;
  salaryStructureDataItem: SalaryStructureDataItem;
};

export const SalaryStructureOptionsAutoComplete = <P extends FieldValues>({
  optionType,
  structure_by = "monthly",
  structure_type = "custom",
  salaryStructureDataItem,
  ...props
}: SalaryStructureOptionsAutoCompleteProps<P>) => {
  const options = useMemo(() => {
    return getDynamicOptions({
      optionType,
      salaryStructureDataItem,
      structure_by,
      structure_type,
    });
  }, [salaryStructureDataItem, structure_type, structure_by, optionType]);

  return <Autocomplete options={options} {...props} />;
};

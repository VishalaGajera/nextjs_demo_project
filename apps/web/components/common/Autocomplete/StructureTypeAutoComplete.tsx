import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetStructureTypeOptions } from "./hooks/useGetStructureTypeOptions";

type StructureTypeAutoCompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const StructureTypeAutoComplete = <P extends FieldValues>({
  ...props
}: StructureTypeAutoCompleteProps<P>) => {
  const { structureTypeOption } = useGetStructureTypeOptions();

  return (
    <Autocomplete
      label="Salary Structure Type"
      options={structureTypeOption}
      placeholder="Select Structure Type"
      {...props}
    />
  );
};

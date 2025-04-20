import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetStructureByOptions } from "./hooks/useGetStructureByOptions";

type StructureByAutoCompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const StructureByAutoComplete = <P extends FieldValues>({
  ...props
}: StructureByAutoCompleteProps<P>) => {
  const { structureByOption } = useGetStructureByOptions();

  return (
    <Autocomplete
      label="Salary Structure By"
      options={structureByOption}
      placeholder="Select Structure By"
      {...props}
    />
  );
};

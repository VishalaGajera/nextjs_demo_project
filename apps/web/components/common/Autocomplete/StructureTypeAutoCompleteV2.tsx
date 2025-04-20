import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetStructureTypeOptionsV2 } from "./hooks/useGetStructureTypeOptionsV2";

type StructureTypeAutoCompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  optionsTypes?: ("custom" | "range")[];
};

export const StructureTypeAutoCompleteV2 = <P extends FieldValues>({
  ...props
}: StructureTypeAutoCompleteProps<P>) => {
  const { structureTypeOption } = useGetStructureTypeOptionsV2({
    options: props.optionsTypes,
  });

  return (
    <Autocomplete
      label="Salary Structure Type"
      options={structureTypeOption}
      placeholder="Select Structure Type"
      {...props}
    />
  );
};

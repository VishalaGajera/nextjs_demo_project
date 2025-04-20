import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import type { OptionsType } from "../../../types/options";
type CriteriaAutoCompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const CriteriaAutoComplete = <P extends FieldValues>(
  props: CriteriaAutoCompleteProps<P>
) => {
  const criteriaOptions: OptionsType[] = [
    {
      label: "Department",
      value: "department",
    },
  ];

  return (
    <Autocomplete
      label="Criteria"
      options={criteriaOptions}
      placeholder="Select Criteria"
      {...props}
    />
  );
};

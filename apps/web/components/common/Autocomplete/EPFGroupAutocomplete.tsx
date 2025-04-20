import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetEPFGroupOptions } from "./hooks/useGetEPFGroupOptions";

type EPFGroupAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const EPFGroupAutocomplete = <P extends FieldValues>(
  props: EPFGroupAutocompleteProps<P>
) => {
  const { data: epfGroupOptions } = useGetEPFGroupOptions();

  return (
    <Autocomplete
      label="PF Group"
      options={epfGroupOptions}
      placeholder="Select PF Group"
      {...props}
    />
  );
};

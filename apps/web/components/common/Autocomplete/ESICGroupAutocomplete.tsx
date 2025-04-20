import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetESICGroupAutocomplete } from "./hooks/useGetESICGroupAutocomplete";

type ESICGroupAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const ESICGroupAutocomplete = <P extends FieldValues>(
  props: ESICGroupAutocompleteProps<P>
) => {
  const { data: esicGroupOptions } = useGetESICGroupAutocomplete();

  return (
    <Autocomplete
      label="ESIC Group"
      options={esicGroupOptions}
      placeholder="Select ESIC Group"
      {...props}
    />
  );
};

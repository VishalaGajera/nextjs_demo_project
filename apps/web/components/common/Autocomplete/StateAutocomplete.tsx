import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetState } from "../../../hooks/useGetState";

type StateAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  countryId: string | null;
};

export const StateAutocomplete = <P extends FieldValues>({
  countryId,
  ...props
}: StateAutocompleteProps<P>) => {
  const { data: stateOptions = [] } = useGetState({
    countryId,
  });

  return (
    <Autocomplete
      label="State/Province"
      options={stateOptions}
      placeholder="Select State"
      {...props}
    />
  );
};

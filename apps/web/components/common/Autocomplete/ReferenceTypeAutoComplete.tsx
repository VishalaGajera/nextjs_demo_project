import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetReferenceTypeOptions } from "./hooks/useGetReferenceTypeOptions";

type ReferenceTypeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
>;

export const ReferenceTypeAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: ReferenceTypeAutocompleteProps<P>) => {
  const { referenceTypeOptions } = useGetReferenceTypeOptions();

  return (
    <Autocomplete
      label="Reference Type"
      options={referenceTypeOptions}
      placeholder="Select Reference Type"
      loading={loading}
      {...props}
    />
  );
};

import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetSubCasteOptions } from "./hooks/useGetSubCasteOptions";

type SubCasteAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  employeeId: string;
  castValue: string;
  loading?: boolean;
};

export const SubCasteAutocomplete = <P extends FieldValues>({
  loading,
  employeeId,
  castValue,
  ...props
}: SubCasteAutocompleteProps<P>) => {
  const { data: stateOptions } = useGetSubCasteOptions({
    employeeId,
    castValue,
  });

  return (
    <Autocomplete
      label="Sub Caste"
      options={stateOptions}
      placeholder="Select Sub Caste"
      loading={loading}
      {...props}
    />
  );
};

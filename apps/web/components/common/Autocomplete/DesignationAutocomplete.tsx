import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetDesignationOptions } from "./hooks/useGetdesignationsOptions";

type DesignationAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  companyId?: string | null;
};

export const DesignationAutocomplete = <P extends FieldValues>({
  companyId,
  ...props
}: DesignationAutocompleteProps<P>) => {
  const { data: designationsOptions } = useGetDesignationOptions({
    companyId,
  });

  return (
    <Autocomplete
      label="Designation"
      options={designationsOptions}
      placeholder="Select Designation"
      {...props}
    />
  );
};

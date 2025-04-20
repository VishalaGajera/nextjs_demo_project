import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGeQualificationOption } from "./hooks/useGetQualificationOptions";

type QualificationAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
>;

export const QualificationAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: QualificationAutocompleteProps<P>) => {
  const { qualificationOptions } = useGeQualificationOption();

  return (
    <Autocomplete
      label="Qualification"
      options={qualificationOptions}
      placeholder="Select Qualification"
      loading={loading}
      {...props}
    />
  );
};

import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetGradeOptions } from "./hooks/useGetGradeOptions";

type GradeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  companyId: string;
};

export const GradeAutocomplete = <P extends FieldValues>({
  companyId,
  ...props
}: GradeAutocompleteProps<P>) => {
  const { data: gradeOptions } = useGetGradeOptions({
    companyId,
  });

  return (
    <Autocomplete
      label="Grade"
      options={gradeOptions}
      placeholder="Select Grade"
      {...props}
    />
  );
};

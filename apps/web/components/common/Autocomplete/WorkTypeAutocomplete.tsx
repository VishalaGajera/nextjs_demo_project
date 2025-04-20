import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetWorkTypeOptions } from "./hooks/useGetWorkTypeOptions";

type WorkTypeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  companyId: string;
};

export const WorkTypeAutocomplete = <P extends FieldValues>({
  companyId,
  ...props
}: WorkTypeAutocompleteProps<P>) => {
  const { data: workTypeOptions } = useGetWorkTypeOptions({
    companyId,
  });

  return (
    <Autocomplete
      label="Work Type"
      options={workTypeOptions}
      placeholder="Select Work type"
      {...props}
    />
  );
};

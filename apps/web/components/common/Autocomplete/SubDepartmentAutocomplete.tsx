import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetSubDepartmentOptions } from "./hooks/useGetSubDepartmentOptions";

type SubDepartmentAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  departmentId?: string | null;
};

export const SubDepartmentAutocomplete = <P extends FieldValues>({
  departmentId,
  ...props
}: SubDepartmentAutocompleteProps<P>) => {
  const { data: subDepartmentOptions } = useGetSubDepartmentOptions({
    departmentId,
  });

  return (
    <Autocomplete
      label="Sub Department"
      options={subDepartmentOptions}
      placeholder="Select Sub Department"
      {...props}
    />
  );
};

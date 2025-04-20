import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetComponentTypeOptions } from "./hooks/useGetComponentTypeOptions";

type ComponentTypeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
};

export const ComponentTypeAutocomplete = <P extends FieldValues>({
  loading = false,
  ...props
}: ComponentTypeAutocompleteProps<P>) => {
  const { componentTypeOptions } = useGetComponentTypeOptions();

  return (
    <Autocomplete
      label="Component"
      options={componentTypeOptions}
      placeholder="Select Component"
      loading={loading}
      {...props}
    />
  );
};

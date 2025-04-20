import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetTitleOptions } from "./hooks/useGetTitleOptions";

type TitleAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
};

export const TitleAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: TitleAutocompleteProps<P>) => {
  const { titleOptions } = useGetTitleOptions();

  return (
    <Autocomplete
      label="Title"
      options={titleOptions}
      placeholder="Select Title"
      loading={loading}
      {...props}
    />
  );
};

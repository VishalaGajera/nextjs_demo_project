import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetMeasureUnitOptions } from "./hooks/useGetMeasureUnitOptions";

type MeasureUnitAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
};

export const MeasureUnitAutocomplete = <P extends FieldValues>({
  loading = false,
  ...props
}: MeasureUnitAutocompleteProps<P>) => {
  const { measureUnitOptions } = useGetMeasureUnitOptions();

  return (
    <Autocomplete
      label="Leave Measure Unit"
      options={measureUnitOptions}
      placeholder="Select Measure Unit"
      loading={loading}
      {...props}
    />
  );
};

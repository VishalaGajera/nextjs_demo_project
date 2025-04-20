import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetExcelMasterOptions } from "./hooks/useGetExcelMasterOptions";

type ExcelMasterAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const ExcelMasterAutocomplete = <P extends FieldValues>(
  props: ExcelMasterAutocompleteProps<P>
) => {
  const { data: excelMasterOptions } = useGetExcelMasterOptions();

  return (
    <Autocomplete
      label="Excel Template For"
      options={excelMasterOptions}
      placeholder="Select Excel Template For"
      {...props}
    />
  );
};

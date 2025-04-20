import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetOvertimeRateTypeOptions } from "./hooks/useGetOvertimeRateTypeOptions";

type OvertimeRateTypeAutoCompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  companyId: string;
};

export const OvertimeRateTypeAutoComplete = <P extends FieldValues>({
  companyId,
  loading,
  ...props
}: OvertimeRateTypeAutoCompleteProps<P>) => {
  const { data: OvertimeRateTypeOptions } = useGetOvertimeRateTypeOptions({
    companyId,
  });

  return (
    <Autocomplete
      label="Overtime Rate Type"
      loading={loading}
      options={OvertimeRateTypeOptions ?? []}
      placeholder="Select Overtime Rate Type"
      {...props}
    />
  );
};

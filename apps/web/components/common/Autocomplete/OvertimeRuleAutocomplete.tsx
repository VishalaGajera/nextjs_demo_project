import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useOvertimeRuleOptions } from "./hooks/useOvertimeRuleOptions";

type OvertimeRuleAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  companyId: string;
};

export const OvertimeRuleAutocomplete = <P extends FieldValues>({
  companyId,
  ...props
}: OvertimeRuleAutocompleteProps<P>) => {
  const { data: departmentOptions } = useOvertimeRuleOptions({
    companyId,
  });

  return (
    <Autocomplete
      label="Overtime Rule"
      options={departmentOptions}
      placeholder="Select Overtime Rule"
      {...props}
    />
  );
};

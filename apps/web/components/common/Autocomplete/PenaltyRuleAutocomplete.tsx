import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { usePenaltyRuleOptions } from "./hooks/useGetPenaltyRuleOptions";

type PenaltyRuleAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  companyId?: string | null;
};

export const PenaltyRuleAutocomplete = <P extends FieldValues>({
  companyId,
  ...props
}: PenaltyRuleAutocompleteProps<P>) => {
  const { data: penaltyRuleOptions } = usePenaltyRuleOptions({
    companyId,
  });

  return (
    <Autocomplete
      label="Attendance Penalty Rule"
      options={penaltyRuleOptions}
      placeholder="Select Attendance Penalty Rule"
      {...props}
    />
  );
};

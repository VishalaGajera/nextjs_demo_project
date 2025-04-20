import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useAttendancePenaltyRuleOptions } from "./hooks/useAttendancePenaltyRuleOptions";

type AttendancePenaltyRuleAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  companyId: string;
};

export const AttendancePenaltyRuleAutocomplete = <P extends FieldValues>({
  companyId,
  ...props
}: AttendancePenaltyRuleAutocompleteProps<P>) => {
  const { data: departmentOptions } = useAttendancePenaltyRuleOptions({
    companyId,
  });

  return (
    <Autocomplete
      label="Attendance Penalty Rule"
      options={departmentOptions}
      placeholder="Select Attendance Penalty Rule"
      {...props}
    />
  );
};

import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

type LeaveReasonAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
>;

export const LeaveReasonAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: LeaveReasonAutocompleteProps<P>) => {
  return (
    <Autocomplete
      options={[]}
      placeholder="Enter Leave Reason"
      loading={loading}
      {...props}
    />
  );
};

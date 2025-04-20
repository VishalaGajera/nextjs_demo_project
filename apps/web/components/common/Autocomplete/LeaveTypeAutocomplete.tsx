import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetLeaveTypeOptions } from "./hooks/useGetLeaveTypeOption";

type LeaveTypeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
};

export const LeaveTypeAutocomplete = <P extends FieldValues>({
  loading = false,
  ...props
}: LeaveTypeAutocompleteProps<P>) => {
  const { leaveTypeOptions } = useGetLeaveTypeOptions();

  return (
    <Autocomplete
      label="Leave Type"
      options={leaveTypeOptions}
      placeholder="Select Leave Type"
      loading={loading}
      {...props}
    />
  );
};

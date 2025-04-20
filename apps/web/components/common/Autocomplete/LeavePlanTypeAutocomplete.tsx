import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetTypesOptions } from "./hooks/useGetLeaveTypesOptions";

type LeaveTypesAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
> & {
  leavePlanId: string;
};

export const LeaveTypesAutocomplete = <P extends FieldValues>({
  loading,
  leavePlanId,
  ...props
}: LeaveTypesAutocompleteProps<P>) => {
  const { data: leavTypesOptions } = useGetTypesOptions({
    leavePlanId,
  });

  return (
    <Autocomplete
      label="Leave Type"
      options={leavTypesOptions}
      placeholder="Select Leave Type"
      loading={loading}
      {...props}
    />
  );
};

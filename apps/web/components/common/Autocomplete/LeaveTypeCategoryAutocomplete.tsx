import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetLeaveTypeCategoryOptions } from "./hooks/useGetLeaveTypeCategoryOptions";

type LeaveTypeCategoryAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  leavePlanId: string;
  leaveTypeId: string;
};

export const LeaveTypeCategoryAutocomplete = <P extends FieldValues>({
  leavePlanId,
  leaveTypeId,
  ...props
}: LeaveTypeCategoryAutocompleteProps<P>) => {
  const { data: LeaveTypeCategoryOption } = useGetLeaveTypeCategoryOptions({
    leavePlanId,
    leaveTypeId,
  });

  return (
    <Autocomplete
      options={LeaveTypeCategoryOption}
      placeholder="leave type"
      {...props}
    />
  );
};

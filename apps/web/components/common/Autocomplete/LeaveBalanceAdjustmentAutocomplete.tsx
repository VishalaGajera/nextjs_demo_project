//LeaveBalanceAdjustmentAutocomplete
import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetLeaveBalanceAdjustmentOptions } from "./hooks/useGetLeaveBalanceAdjustmentOptions";

type LeaveBalanceAdjustmentAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const LeaveBalanceAdjustmentAutocomplete = <P extends FieldValues>({
  ...props
}: LeaveBalanceAdjustmentAutocompleteProps<P>) => {
  const { leaveBalanceAdjustmentOptions } =
    useGetLeaveBalanceAdjustmentOptions();

  return (
    <Autocomplete
      options={leaveBalanceAdjustmentOptions}
      placeholder="Select Leave Balance"
      {...props}
    />
  );
};

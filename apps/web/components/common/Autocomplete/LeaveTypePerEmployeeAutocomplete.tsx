import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetLeaveTypePerEmployeeOptions } from "./hooks/useGetLeaveTypePerEmployeeOptions";

type LeaveTypePerEmployeeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
> & {
  leavePlanId: string;
  employeeId: string;
  fromDate: string;
};

export const LeaveTypePerEmployeeAutocomplete = <P extends FieldValues>({
  loading,
  leavePlanId,
  employeeId,
  fromDate,
  ...props
}: LeaveTypePerEmployeeAutocompleteProps<P>) => {
  const { data: leavTypesOptions } = useGetLeaveTypePerEmployeeOptions({
    leavePlanId,
    employeeId,
    fromDate,
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

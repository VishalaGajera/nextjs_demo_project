import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetLeavePlanOptions } from "./hooks/useGetLeavePlansOptions";

type LeavePlanAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  companyId: string;
};

export const LeavePlanAutocomplete = <P extends FieldValues>({
  companyId,
  ...props
}: LeavePlanAutocompleteProps<P>) => {
  const { data: leavePlanOptions } = useGetLeavePlanOptions({
    companyId,
  });

  return (
    <Autocomplete
      label="Leave Plan"
      options={leavePlanOptions}
      placeholder="Select Leave Plan"
      {...props}
    />
  );
};

import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetPayScheduleOptions } from "./Hooks/useGetPayScheduleOptions";

type PayScheduleAutoCompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  companyId: string;
};

export const PayScheduleAutoComplete = <P extends FieldValues>({
  companyId,
  ...props
}: PayScheduleAutoCompleteProps<P>) => {
  const { data: options } = useGetPayScheduleOptions({
    companyId,
  });

  return (
    <Autocomplete
      label="Pay Schedule"
      options={options}
      placeholder="Select Pay Schedule"
      {...props}
    />
  );
};

import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useScheduleTypeOptions } from "./hooks/useScheduleTypeOptions";

type ScheduleTypeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const ScheduleTypeAutocomplete = <P extends FieldValues>({
  ...props
}: ScheduleTypeAutocompleteProps<P>) => {
  const { scheduleTypeOptions } = useScheduleTypeOptions();

  return (
    <Autocomplete
      options={scheduleTypeOptions}
      placeholder="Select Day"
      {...props}
    />
  );
};

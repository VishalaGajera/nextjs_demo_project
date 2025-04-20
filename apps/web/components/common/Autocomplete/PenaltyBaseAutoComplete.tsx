import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetPenaltyBaseOptions } from "./hooks/useGetPenaltyBaseOptions";

type PenaltyBaseAutoCompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
  hideLabel?: boolean;
};

export const PenaltyBaseAutoComplete = <P extends FieldValues>({
  loading = false,
  hideLabel = false,
  ...props
}: PenaltyBaseAutoCompleteProps<P>) => {
  const { penaltyBaseOptions } = useGetPenaltyBaseOptions();

  return (
    <Autocomplete
      label={hideLabel ? "" : "Penalty Basis"}
      options={penaltyBaseOptions}
      placeholder="Select Penalty Basis"
      loading={loading}
      {...props}
    />
  );
};

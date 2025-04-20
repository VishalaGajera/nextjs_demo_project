import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useGetEvaluationPeriodOptions } from "./hooks/useGetEvaluationPeriodOptions";

type EvaluationPeriodAutoCompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
  hideLabel?: boolean;
  excludeDay?: boolean;
};

export const EvaluationPeriodAutoComplete = <P extends FieldValues>({
  loading = false,
  hideLabel = false,
  excludeDay = false,
  ...props
}: EvaluationPeriodAutoCompleteProps<P>) => {
  const { evaluationPeriodOptions } = useGetEvaluationPeriodOptions(excludeDay);

  return (
    <Autocomplete
      label={hideLabel ? "" : "Evaluation Period"}
      options={evaluationPeriodOptions}
      placeholder="Select Evaluation Period"
      loading={loading}
      {...props}
    />
  );
};

export function useGetEvaluationPeriodOptions(excludeDay: boolean = false) {
  const evaluationPeriodOptions = [
    { label: "Month", value: "month" },
    { label: "Week", value: "week" },
    { label: "Day", value: "day" },
  ];

  const filteredOptions = excludeDay
    ? evaluationPeriodOptions.filter((option) => option.value !== "day")
    : evaluationPeriodOptions;

  return { evaluationPeriodOptions: filteredOptions };
}

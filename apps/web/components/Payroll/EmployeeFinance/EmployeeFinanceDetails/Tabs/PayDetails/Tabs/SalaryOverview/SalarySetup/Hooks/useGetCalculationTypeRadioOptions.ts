export function useGetCalculationTypeRadioOptions() {
  const calculationTypeRadioOptions = [
    {
      label: "Monthly",
      values: "monthly",
      disabled: false,
    },
    {
      label: "Daily",
      values: "daily",
      disabled: false,
    },
    {
      label: "Hourly",
      values: "hourly",
      disabled: false,
    },
    {
      label: "Fixed",
      values: "fixed",
      disabled: false,
    },
    {
      label: "Other",
      values: "others",
      disabled: false,
    },
  ];

  return { calculationTypeRadioOptions };
}

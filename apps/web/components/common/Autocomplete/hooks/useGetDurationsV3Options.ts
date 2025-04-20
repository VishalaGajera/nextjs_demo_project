export function useGetDurationsV3Options() {
  const durationOptions = [
    { label: "Monthly", value: "monthly" },

    { label: "Half Yearly", value: "half_yearly" },

    { label: "Yearly", value: "yearly" },

    { label: "Quarterly", value: "quarterly" },
  ];

  return { durationOptions };
}

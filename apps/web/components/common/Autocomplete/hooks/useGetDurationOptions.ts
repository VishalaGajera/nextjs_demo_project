export function useGetDurationOptions() {
  const durationOptions = [
    { label: "Monthly", value: "monthly" },

    { label: "Half Yearly", value: "half_yearly" },

    { label: "Yearly", value: "yearly" },
  ];

  return { durationOptions };
}

export function useGetDurationsOptions() {
  const durationsOption = [
    { label: "Once a month", value: "monthly" },
    { label: "Once a Quarterly", value: "quarterly" },
    { label: "Once a Half Yearly", value: "half_yearly" },
    { label: "Once a Yearly", value: "yearly" },
  ];

  return { durationsOption };
}

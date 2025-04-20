export function useGetStructureByOptions() {
  const structureByOption = [
    { label: "Monthly", value: "monthly" },
    { label: "Annually", value: "annually" },
    { label: "Daily", value: "daily" },
    { label: "Hourly", value: "hourly" },
  ];

  return { structureByOption };
}

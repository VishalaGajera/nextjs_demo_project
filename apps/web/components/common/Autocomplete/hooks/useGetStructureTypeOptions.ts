export function useGetStructureTypeOptions() {
  const structureTypeOption = [
    { label: "Range Based", value: "range" },
    { label: "Custom Based", value: "custom" },
  ];

  return { structureTypeOption };
}

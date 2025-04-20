export function useGetMaritalStatusOption() {
  const maritalStatusOption = [
    { label: "Single", value: "single" },
    { label: "Married", value: "married" },
    { label: "Divorced", value: "divorced" },
    { label: "Widowed", value: "widowed" },
  ];

  return { maritalStatusOption };
}

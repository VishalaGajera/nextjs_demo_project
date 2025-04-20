export function useGetInsuranceTypeOptions() {
  const insuranceTypeOptions = [
    { label: "Life", value: "life" },
    { label: "Health", value: "health" },
    { label: "Home", value: "home" },
  ];

  return { insuranceTypeOptions };
}

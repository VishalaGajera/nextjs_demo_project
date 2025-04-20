export function useGetRegimeOptions() {
  const regimeOptions = [
    { value: "old", label: "Old Tax Regime" },
    { value: "new", label: "New Tax Regime" },
  ];

  return { regimeOptions };
}

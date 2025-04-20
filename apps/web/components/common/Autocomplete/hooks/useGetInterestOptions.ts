export function useGetInsterestOptions() {
  const interestOptions = [
    { label: "Flat", value: "flat" },
    { label: "Reduce", value: "reduce" },
  ];

  return { interestOptions };
}

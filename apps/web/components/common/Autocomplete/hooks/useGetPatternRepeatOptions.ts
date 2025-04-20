export function useGetPatternRepeatOptions() {
  const patternRepeatOptions = Array.from({ length: 5 }, (_, i) => ({
    label: (i + 1).toString(),
    value: i + 1,
  }));

  return { patternRepeatOptions };
}

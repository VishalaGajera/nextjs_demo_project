export const useGetFinancialYearOptions = (
  startYear: number,
  count: number
) => {
  return Array.from({ length: count }, (_, index) => {
    const currentYear = startYear + index;

    const nextYear = currentYear + 1;

    return {
      value: `${currentYear}-04-01 | ${nextYear}-03-31`,
      label: `Apr ${currentYear} - Mar ${nextYear}`,
    };
  });
};

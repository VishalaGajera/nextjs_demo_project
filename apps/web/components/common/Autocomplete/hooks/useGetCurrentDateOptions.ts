import { DateTime } from "luxon";

const currentYear = DateTime.now().year.toString();

const previousYear = DateTime.now().minus({ years: 1 }).year.toString();

export function useGetCurrentDateOptions() {
  const currentDateOption = [
    { label: currentYear, value: currentYear },
    { label: previousYear, value: previousYear },
  ];

  return { currentDateOption };
}

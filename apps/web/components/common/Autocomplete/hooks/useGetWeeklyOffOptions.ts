export function useGetWeeklyOffOptions() {
  const weeklyOffOption = [
    { label: "Full Day", value: "full_day" },
    { label: "First Half", value: "first_half" },
    { label: "Second Half", value: "second_half" },
  ];

  return { weeklyOffOption };
}

import { FIRST_HALF, FULL_DAY, SECOND_HALF } from "./constant";

export const WeeklyOff = {
  [FULL_DAY]: "Full Day",
  [FIRST_HALF]: "First Half",
  [SECOND_HALF]: "Second Half",
};

export type WeeklyOffOptionsOptionsKey = keyof typeof WeeklyOff;

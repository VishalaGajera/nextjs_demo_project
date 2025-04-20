export type WeekDaysOptions =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export function useWeekDaysOptions() {
  const weekDaysOptions = [
    { label: "Sunday", value: "sunday" },

    { label: "Monday", value: "monday" },

    { label: "Tuesday", value: "tuesday" },

    { label: "Wednesday", value: "wednesday" },

    { label: "Thursday", value: "thursday" },

    { label: "Friday", value: "friday" },

    { label: "Saturday", value: "saturday" },
  ];

  return { weekDaysOptions };
}

export function useScheduleTypeOptions() {
  const scheduleTypeOptions = [
    { label: "Calender Days", value: "calender_days" },
    { label: "Leave Days", value: "leave_days" },
  ];

  return { scheduleTypeOptions };
}

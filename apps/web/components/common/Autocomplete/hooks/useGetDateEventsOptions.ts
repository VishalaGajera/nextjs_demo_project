export function useGetDateEventsOptions() {
  const dateEventOptions = [
    { label: "joining date", value: "date_of_joining" },
    { label: "probation end", value: "probation_end_date" },
  ];

  return { dateEventOptions };
}

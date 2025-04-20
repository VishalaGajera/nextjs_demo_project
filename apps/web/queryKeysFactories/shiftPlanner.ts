export const shiftPlannerKeys = {
  all: ["shift-planner"] as const,

  listing: (date: string, body: object = {}) => [
    ...shiftPlannerKeys.all,
    "listing",
    date,
    body,
  ],

  edit: (currentDate: string) => [...shiftPlannerKeys.all, "edit", currentDate],
};

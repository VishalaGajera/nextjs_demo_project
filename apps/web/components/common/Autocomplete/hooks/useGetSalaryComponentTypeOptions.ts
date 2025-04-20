import { ONE_TIME, RECURRING } from "./constant";

export const SalaryComponentTypeOptions = {
  [RECURRING]: "Recurring",
  [ONE_TIME]: "One Time",
};

export type SalaryComponentTypeOptionsKey =
  keyof typeof SalaryComponentTypeOptions;

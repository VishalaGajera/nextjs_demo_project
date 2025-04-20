import { ADVANCE, ALLOWANCE, ARREAR, BONUS, FIXED } from "./constant";

export function useGetEarningComponentTypeOptions() {
  const earningComponentTypeOption = [
    { label: "Fixed", value: "fixed" },
    { label: "Allowance", value: "allowance" },
    { label: "Arrear", value: "arrear" },
    { label: "Bonus", value: "bonus" },
    { label: "Advance", value: "advance" },
  ];

  return { earningComponentTypeOption };
}

export const EarningComponentTypeOptions = {
  [FIXED]: "Fixed",
  [ALLOWANCE]: "Allowance",
  [ARREAR]: "Arrear",
  [BONUS]: "Bonus",
  [ADVANCE]: "Advance",
};

export type EarningComponentTypeOptionsKey =
  keyof typeof EarningComponentTypeOptions;

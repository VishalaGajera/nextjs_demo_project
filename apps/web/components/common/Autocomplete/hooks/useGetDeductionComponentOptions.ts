import { DEDUCTION, TAX } from "./constant";
export function useGetDeductionComponentOptions() {
  const deductionComponentOption = [
    { label: "Deduction", value: "deduction" },
    { label: "Tax", value: "tax" },
  ];

  return { deductionComponentOption };
}

export const DeductionComponentTypeOptions = {
  [DEDUCTION]: "Deduction",
  [TAX]: "Tax",
};

export type DeductionComponentTypeOptionsKey =
  keyof typeof DeductionComponentTypeOptions;

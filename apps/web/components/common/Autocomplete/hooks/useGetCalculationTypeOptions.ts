import { z } from "zod";
import { ADJUSTMENT, FIXED, PERCENTAGE } from "./constant";

const calculationTypes = {
  [ADJUSTMENT]: "Adjustment",
  [FIXED]: "Amount",
  [PERCENTAGE]: "Percentage",
};

export type CalculationTypeKeys = keyof typeof calculationTypes;

export const CalculationTypeSchema = z.enum([ADJUSTMENT, FIXED, PERCENTAGE]);

export const useGetCalculationTypeOptions = () => {
  const calculationTypeOptions = [
    { value: ADJUSTMENT, label: calculationTypes[ADJUSTMENT] },
    { value: FIXED, label: calculationTypes[FIXED] },
    { value: PERCENTAGE, label: calculationTypes[PERCENTAGE] },
  ];

  return {
    calculationTypeOptions,
  };
};

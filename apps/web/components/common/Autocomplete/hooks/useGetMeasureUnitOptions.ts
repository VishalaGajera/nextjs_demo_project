import { z } from "zod";
import { DAY, HOUR } from "./constant";

const measureUnitTypes = {
  [DAY]: "Day",
  [HOUR]: "Hour",
};

export type MeasureUnit = keyof typeof measureUnitTypes;

export const measureUnitTypesSchema = z.enum([DAY, HOUR]);

export function useGetMeasureUnitOptions() {
  const measureUnitOptions = [
    { label: measureUnitTypes[DAY], value: DAY },
    { label: measureUnitTypes[HOUR], value: HOUR },
  ];

  return { measureUnitOptions };
}

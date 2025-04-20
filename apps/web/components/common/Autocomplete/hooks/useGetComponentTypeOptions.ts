import { z } from "zod";
import { ADVANCE, RECEIVE } from "./constant";

const componentTypes = {
  [ADVANCE]: "Advance",
  [RECEIVE]: "Receive",
};

export type ComponentTypeKeys = keyof typeof componentTypes;

export const ComponentTypeSchema = z.enum([ADVANCE, RECEIVE]).nullable();

export function useGetComponentTypeOptions() {
  const componentTypeOptions = [
    { label: componentTypes[ADVANCE], value: ADVANCE },
    { label: componentTypes[RECEIVE], value: RECEIVE },
  ];

  return { componentTypeOptions };
}

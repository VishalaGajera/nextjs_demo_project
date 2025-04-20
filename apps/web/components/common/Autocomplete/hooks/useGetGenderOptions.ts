import { z } from "zod";
import { FEMALE, MALE, OTHER } from "./constant";

const genderTypes = {
  [MALE]: "Male",
  [FEMALE]: "Female",
  [OTHER]: "Other",
};

export type Gender = keyof typeof genderTypes;

export const GenderTypeSchema = z.enum([MALE, FEMALE, OTHER]);

export function useGetGenderOptions() {
  const genderOptions = [
    { label: genderTypes[MALE], value: MALE },
    { label: genderTypes[FEMALE], value: FEMALE },
    { label: genderTypes[OTHER], value: OTHER },
  ];

  return { genderOptions };
}

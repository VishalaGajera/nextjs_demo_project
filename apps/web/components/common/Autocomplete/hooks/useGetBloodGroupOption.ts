import { z } from "zod";
import {
  A_Negative,
  A_Positive,
  AB_Negative,
  AB_Positive,
  B_Negative,
  B_Positive,
  O_Negative,
  O_Positive,
} from "./constant";

const BloodGroups = {
  [A_Positive]: "A+",
  [A_Negative]: "A-",
  [B_Positive]: "B+",
  [B_Negative]: "B-",
  [O_Positive]: "O+",
  [O_Negative]: "O-",
  [AB_Positive]: "AB+",
  [AB_Negative]: "AB-",
};

export type BloodGroup = keyof typeof BloodGroups;

export const BloodTypeSchema = z.enum([
  A_Positive,
  A_Negative,
  B_Positive,
  B_Negative,
  O_Positive,
  O_Negative,
  AB_Positive,
  AB_Negative,
]);

export function useGetBloodGroupOptions() {
  const bloodGroupOptions = [
    { label: BloodGroups[A_Positive], value: A_Positive },
    { label: BloodGroups[A_Negative], value: A_Negative },
    { label: BloodGroups[B_Positive], value: B_Positive },
    { label: BloodGroups[B_Negative], value: B_Negative },
    { label: BloodGroups[O_Positive], value: O_Positive },
    { label: BloodGroups[O_Negative], value: O_Negative },
    { label: BloodGroups[AB_Positive], value: AB_Positive },
    { label: BloodGroups[AB_Negative], value: AB_Negative },
  ];

  return { bloodGroupOptions };
}

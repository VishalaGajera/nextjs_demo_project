import { z } from "zod";
import { AUTO, BOTH, MANUAL } from "./constant";

export const employeeCodeTypes = {
  [AUTO]: "Auto",
  [MANUAL]: "Manual",
  [BOTH]: "Both",
};

export type EmployeeCodeTypeKeys = keyof typeof employeeCodeTypes;

export const EmployeeCodeTypeSchema = z.enum([AUTO, MANUAL, BOTH]);

export function useGetEmployeeCodeTypeOptions() {
  const employeeCodeTypeOptions = [
    { label: employeeCodeTypes[AUTO], value: AUTO },
    { label: employeeCodeTypes[MANUAL], value: MANUAL },
    { label: employeeCodeTypes[BOTH], value: BOTH },
  ];

  return { employeeCodeTypeOptions };
}

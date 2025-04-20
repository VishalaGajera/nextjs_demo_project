import { z } from "zod";
import { INCIDENT, PAID, UNPAID } from "./constant";

const leaveTypes = {
  [PAID]: "Paid",
  [UNPAID]: "Unpaid",
  [INCIDENT]: "Incident",
};

export type Leave = keyof typeof leaveTypes;

export const LeaveTypeSchema = z.enum([PAID, UNPAID, INCIDENT]);

export function useGetLeaveTypeOptions() {
  const leaveTypeOptions = [
    { label: leaveTypes[PAID], value: PAID },
    { label: leaveTypes[UNPAID], value: UNPAID },
    { label: leaveTypes[INCIDENT], value: INCIDENT },
  ];

  return { leaveTypeOptions };
}

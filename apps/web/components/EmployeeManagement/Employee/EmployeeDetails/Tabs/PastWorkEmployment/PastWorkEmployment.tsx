import type { PageProps } from "../../../../../../app/employee-management/employee/[employeeId]/page";
import { PastWorkEmploymentCard } from "./PastWorkEmploymentCard/PastWorkEmploymentCard";
type PastWorkEmploymentProps = Readonly<PageProps["params"]>;

export function PastWorkEmployment({ employeeId }: PastWorkEmploymentProps) {
  return <PastWorkEmploymentCard employeeId={employeeId} />;
}

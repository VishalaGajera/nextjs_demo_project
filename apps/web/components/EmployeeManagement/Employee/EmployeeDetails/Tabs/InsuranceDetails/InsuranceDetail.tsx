import type { PageProps } from "../../../../../../app/employee-management/employee/[employeeId]/page";
import { InsuranceDetailCard } from "./InsuranceDetailCard/InsuranceDetailCard";
type InsuranceDetailProps = Readonly<PageProps["params"]>;

export function InsuranceDetail({ employeeId }: InsuranceDetailProps) {
  return <InsuranceDetailCard employeeId={employeeId} />;
}

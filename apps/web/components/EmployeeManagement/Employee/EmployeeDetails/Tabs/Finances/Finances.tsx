import type { ButtonViewTypeKeys } from "../../../../../../app/employee-management/employee/hooks/useGetButtonOptions";
import { Tabs } from "./Tabs/Tabs";

type FinancesArgs = Readonly<{
  employeeId: string;
  view: ButtonViewTypeKeys;
}>;

export const Finances = ({ employeeId, view }: FinancesArgs) => {
  return <Tabs employeeId={employeeId} view={view} />;
};

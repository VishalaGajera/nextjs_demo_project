import type { ButtonViewTypeKeys } from "../../../../../../app/employee-management/employee/hooks/useGetButtonOptions";
import { Tabs } from "./Tabs/Tabs";

type EmployeeWorkPostArgs = {
  employeeId: Readonly<string>;
  view: ButtonViewTypeKeys;
};

export const EmployeeWorkPost = ({
  employeeId,
  view,
}: EmployeeWorkPostArgs) => {
  return (
    <div>
      <Tabs employeeId={employeeId} view={view} />
    </div>
  );
};

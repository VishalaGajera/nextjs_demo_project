import type { ButtonViewTypeKeys } from "../../../../../../app/employee-management/employee/hooks/useGetButtonOptions";
import { Tabs } from "./Tabs/Tabs";

type EmployeeDocumentsArgs = Readonly<{
  employeeId: string;
  view: ButtonViewTypeKeys;
}>;

export const EmployeeDocuments = ({
  employeeId,
  view,
}: EmployeeDocumentsArgs) => {
  return (
    <div>
      <Tabs employeeId={employeeId} view={view} />
    </div>
  );
};

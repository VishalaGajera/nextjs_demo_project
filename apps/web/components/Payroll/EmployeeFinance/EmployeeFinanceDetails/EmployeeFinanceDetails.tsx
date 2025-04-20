import { Stack } from "@mui/material";
import { useMemo } from "react";
import { Tabs } from "../EmployeeFinanceDetails/Tabs/Tabs";
import { useGetEmployeeFinanceList } from "../EmployeeFinanceList/Hooks/useGetEmployeeFinanceList";
import { EmployeeFInanceDetailsBreadCrumbs } from "./EmployeeFInanceDetailsBreadCrumbs";
import { EmployeeInfoHeader } from "./EmployeeInfoHeader";
import { getEmployee } from "./Tabs/PayDetails/Tabs/SalaryOverview/SalarySetup/utils/helper";

type EmployeeFinanceDetailsProps = Readonly<{
  employeeId: string;
}>;

export const EmployeeFinanceDetails = ({
  employeeId,
}: EmployeeFinanceDetailsProps) => {
  const {
    data: { employeeFinances },
    isFetching,
  } = useGetEmployeeFinanceList();

  const employeeData = useMemo(() => {
    return getEmployee({
      employeeFinances,
      employeeId,
    });
  }, [employeeFinances]);

  return (
    <Stack gap="15px">
      <EmployeeFInanceDetailsBreadCrumbs />

      <EmployeeInfoHeader employeeData={employeeData} loading={isFetching} />

      <Tabs
        employeeId={employeeId}
        isSetupPendingStatus={!employeeData.salary}
        isLoading={isFetching}
      />
    </Stack>
  );
};

"use client";

import { Stack } from "@mui/material";
import { useMemo } from "react";
import { EmployeeInfoHeader } from "../../../../../components/Payroll/EmployeeFinance/EmployeeFinanceDetails/EmployeeInfoHeader";
import { SalarySetup } from "../../../../../components/Payroll/EmployeeFinance/EmployeeFinanceDetails/Tabs/PayDetails/Tabs/SalaryOverview/SalarySetup/SalarySetup";
import { SalarySetupBreadCrumbs } from "../../../../../components/Payroll/EmployeeFinance/EmployeeFinanceDetails/Tabs/PayDetails/Tabs/SalaryOverview/SalarySetup/SalarySetupBreadCrumbs";
import { getEmployee } from "../../../../../components/Payroll/EmployeeFinance/EmployeeFinanceDetails/Tabs/PayDetails/Tabs/SalaryOverview/SalarySetup/utils/helper";
import { useGetEmployeeFinanceList } from "../../../../../components/Payroll/EmployeeFinance/EmployeeFinanceList/Hooks/useGetEmployeeFinanceList";
import type { PageProps } from "../page";

const Page = ({ params: { employeeId } }: PageProps) => {
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
    <Stack gap="20px">
      <SalarySetupBreadCrumbs employeeId={employeeId} />

      <EmployeeInfoHeader employeeData={employeeData} loading={isFetching} />

      <SalarySetup employeeId={employeeId} />
    </Stack>
  );
};

export default Page;

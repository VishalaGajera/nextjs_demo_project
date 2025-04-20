"use client";

import { Tabs as MuiTabs, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useSearchParams } from "next/navigation";
import { useMemo, type ReactNode } from "react";
import type { ButtonViewTypeKeys } from "../../../../../../../app/employee-management/employee/hooks/useGetButtonOptions";
import {
  BANK_STATUTORY,
  PAY_DETAILS,
} from "../../../../../../Payroll/EmployeeFinance/EmployeeFinanceDetails/Tabs/constants";
import { getEmployee } from "../../../../../../Payroll/EmployeeFinance/EmployeeFinanceDetails/Tabs/PayDetails/Tabs/SalaryOverview/SalarySetup/utils/helper";
import { useGetEmployeeFinanceList } from "../../../../../../Payroll/EmployeeFinance/EmployeeFinanceList/Hooks/useGetEmployeeFinanceList";
import { BankAndStatutory } from "../../BankAndStatutory/BankAndStatutory";
import { PayDetailsTabs } from "../PayDetails/PayDetailsTabs";
import type { OptionKey } from "./hooks/useTabsOptions";
import { useTabOptions } from "./hooks/useTabsOptions";

type TabsProps = Readonly<{
  employeeId: string;
  view: ButtonViewTypeKeys;
}>;

export function Tabs({ employeeId, view }: TabsProps) {
  const { menuItems } = useTabOptions({ employeeId, view });

  const searchParams = useSearchParams();

  const tab = searchParams.get("subtab") ?? "";

  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  const {
    data: { employeeFinances = [] },
    isFetching,
  } = useGetEmployeeFinanceList();

  const employeeData = useMemo(() => {
    return getEmployee({
      employeeFinances,
      employeeId,
    });
  }, [employeeFinances]);

  const categoryRenderer: Record<OptionKey, ReactNode> = {
    [BANK_STATUTORY]: <BankAndStatutory employeeId={employeeId} />,
    [PAY_DETAILS]: (
      <PayDetailsTabs
        isSetupPendingStatus={!employeeData.salary}
        employeeId={employeeId}
        tab={tab}
        isLoading={isFetching}
      />
    ),
  };

  return (
    <>
      <MuiTabs
        value={tab}
        aria-label="secondary tabs example "
        sx={{
          marginBottom: "15px",
          bgcolor: lightBlue[50],
        }}
      >
        {menuItems.map((item) => (
          <Tab
            key={item.value}
            value={item.value}
            label={item.title}
            onClick={item.onClick}
          />
        ))}
      </MuiTabs>
      {tab && categoryRenderer[tab as OptionKey]}
    </>
  );
}

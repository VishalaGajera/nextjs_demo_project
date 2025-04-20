import type { TabsItems } from "@codezee/sixtify-brahma";
import { Tabs as MuiTabs, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { BankAndStatutory } from "../../../../EmployeeManagement/Employee/EmployeeDetails/Tabs/BankAndStatutory/BankAndStatutory";
import { Tabs as PayDetailsTab } from "./PayDetails/Tabs/Tabs";
import { BANK_STATUTORY, PAY_DETAILS } from "./constants";

type CategoryRendererKeys = typeof BANK_STATUTORY | typeof PAY_DETAILS;

type TabsProps = Readonly<{
  employeeId: string;
  isSetupPendingStatus: boolean;
  isLoading: boolean;
}>;

export const Tabs = ({
  employeeId,
  isSetupPendingStatus,
  isLoading = false,
}: TabsProps) => {
  const router = useRouter();

  const menuItems: TabsItems[] = [
    {
      value: BANK_STATUTORY,
      label: "Bank & Statutory",
      onClick: () =>
        router.push(
          `/payroll/employee-finance/${employeeId}?tab=${BANK_STATUTORY}`
        ),
    },
    {
      value: PAY_DETAILS,
      label: "Pay Details",
      onClick: () =>
        router.push(
          `/payroll/employee-finance/${employeeId}?tab=${PAY_DETAILS}`
        ),
    },
  ];

  const searchParams = useSearchParams();

  const tab = searchParams.get("tab") ?? "";

  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  const categoryRenderer: Record<CategoryRendererKeys, ReactNode> = {
    [BANK_STATUTORY]: <BankAndStatutory employeeId={employeeId} />,
    [PAY_DETAILS]: (
      <PayDetailsTab
        isSetupPendingStatus={isSetupPendingStatus}
        employeeId={employeeId}
        tab={tab}
        isLoading={isLoading}
      />
    ),
  };

  const validTabs = Object.keys(categoryRenderer);

  useEffect(() => {
    const isTabValid = validTabs.includes(tab);

    if (tab && isTabValid) {
      return;
    }

    router.push(
      `/payroll/employee-finance/${employeeId}?tab=${BANK_STATUTORY}`
    );
  }, [tab, employeeId, validTabs]);

  return (
    <>
      <MuiTabs
        value={tab}
        aria-label="secondary tabs example "
        sx={{
          borderRadius: "5px",
          bgcolor: lightBlue[50],
        }}
      >
        {menuItems.map((item) => (
          <Tab
            key={item.value}
            value={item.value}
            label={item.label}
            onClick={item.onClick}
          />
        ))}
      </MuiTabs>

      {tab && categoryRenderer[tab as CategoryRendererKeys]}
    </>
  );
};

import type { TabsItems } from "@codezee/sixtify-brahma";
import { Tabs as MuiTabs, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import { type DialogRenderer } from "../../../../../../../types/dialogs";
import { SALARY_OVERVIEW } from "../../../../../../Payroll/EmployeeFinance/EmployeeFinanceDetails/Tabs/constants";
import { SalaryStructureTimeLine } from "../../../../../../Payroll/EmployeeFinance/EmployeeFinanceDetails/Tabs/PayDetails/Tabs/SalaryOverview/SalaryStructureTimeLine";
import { AddSalarySetupDialog } from "./Dialogs/AddSalarySetupDialog/AddSalarySetupDialog";

type CategoryRendererKeys = typeof SALARY_OVERVIEW;

type TabsProps = Readonly<{
  employeeId: string;
  isSetupPendingStatus: boolean;
  tab: string;
  isLoading: boolean;
}>;

export const PayDetailsTabs = ({
  employeeId,
  isSetupPendingStatus,
  tab,
  isLoading,
}: TabsProps) => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const subTab = searchParams.get("subtab");

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const menuItems: TabsItems[] = [
    {
      value: SALARY_OVERVIEW,
      label: "Salary Overview",
      onClick: () =>
        router.push(
          `/employee-management/employee/${employeeId}?tab=${tab}&subtab=${subTab}&detail=${SALARY_OVERVIEW}&view=list`
        ),
    },
  ];

  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  const detail = searchParams.get("detail");

  const categoryRenderer: Record<CategoryRendererKeys, ReactNode> = {
    [SALARY_OVERVIEW]: (
      <SalaryStructureTimeLine
        employeeId={employeeId}
        isLoading={isLoading}
        pageType="dialog"
        action="add"
        onDialogOpen={onDialogOpen}
        tab={tab}
        isSetupPendingStatus={isSetupPendingStatus}
      />
    ),
  };

  const validTabs = Object.keys(categoryRenderer);

  useEffect(() => {
    if (!detail || !validTabs.includes(detail)) {
      router.push(
        `/employee-management/employee/${employeeId}?tab=${tab}&subtab=${subTab}&detail=${SALARY_OVERVIEW}&view=list`
      );
    }
  }, []);

  const dialogRenderer: DialogRenderer = {
    add: employeeId && (
      <AddSalarySetupDialog
        employeeId={employeeId}
        onClose={onDialogClose}
        open
      />
    ),
  };

  return (
    <>
      <MuiTabs
        value={detail}
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

      {detail && categoryRenderer[detail as CategoryRendererKeys]}

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

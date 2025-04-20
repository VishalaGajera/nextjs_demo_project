"use client";

import type { TabsItems } from "@codezee/sixtify-brahma";
import { Tabs as MuiTabs, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { SALARY_OVERVIEW } from "../../constants";
import { SalaryStructureTimeLine } from "./SalaryOverview/SalaryStructureTimeLine";

type CategoryRendererKeys = typeof SALARY_OVERVIEW;

type TabsProps = Readonly<{
  employeeId: string;
  isSetupPendingStatus: boolean;
  tab: string;
  isLoading: boolean;
}>;

export const Tabs = ({
  employeeId,
  isSetupPendingStatus,
  tab,
  isLoading,
}: TabsProps) => {
  const router = useRouter();

  const menuItems: TabsItems[] = [
    {
      value: SALARY_OVERVIEW,
      label: "Salary Overview",
      onClick: () =>
        router.push(
          `/payroll/employee-finance/${employeeId}?tab=${tab}&detail=${SALARY_OVERVIEW}`
        ),
    },
  ];

  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  const searchParams = useSearchParams();

  const detail = searchParams.get("detail");

  const categoryRenderer: Record<CategoryRendererKeys, ReactNode> = {
    [SALARY_OVERVIEW]: (
      <SalaryStructureTimeLine
        employeeId={employeeId}
        isLoading={isLoading}
        tab={tab}
        isSetupPendingStatus={isSetupPendingStatus}
      />
    ),
  };

  const validTabs = Object.keys(categoryRenderer);

  useEffect(() => {
    if (detail && validTabs.includes(detail)) {
      return;
    }

    router.push(
      `/payroll/employee-finance/${employeeId}?tab=${tab}&detail=${SALARY_OVERVIEW}`
    );
  }, [detail, employeeId, validTabs, tab]);

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
    </>
  );
};

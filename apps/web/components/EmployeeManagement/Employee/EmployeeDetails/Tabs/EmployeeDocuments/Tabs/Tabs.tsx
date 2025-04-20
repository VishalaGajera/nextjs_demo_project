"use client";

import { Tabs as MuiTabs, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useSearchParams } from "next/navigation";
import { type ReactNode } from "react";
import type { ButtonViewTypeKeys } from "../../../../../../../app/employee-management/employee/hooks/useGetButtonOptions";
import { Document } from "./EmployeeDocument/Document";
import type { OptionKey } from "./hooks/useTabsOptions";
import { useTabOptions } from "./hooks/useTabsOptions";
type TabsProps = Readonly<{
  employeeId: string;
  view: ButtonViewTypeKeys;
}>;

export function Tabs({ employeeId, view }: TabsProps) {
  const { menuItems } = useTabOptions({ employeeId, view });

  const searchParams = useSearchParams();

  const tab = searchParams.get("subtab");

  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  const categoryRenderer: Record<OptionKey, ReactNode> = {
    document: <Document employeeId={employeeId} />,
    "salary-slip": "Salary Slip",
    letters: "Letters",
    "policies-forms": "Policies & Forms",
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

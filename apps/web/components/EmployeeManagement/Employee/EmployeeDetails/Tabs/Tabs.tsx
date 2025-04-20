"use client";

import { Tabs as MuiTabs, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useSearchParams } from "next/navigation";
import { type ReactNode } from "react";
import type { ButtonViewTypeKeys } from "../../../../../app/employee-management/employee/hooks/useGetButtonOptions";
import { EmployeeAttendance } from "./EmployeeAttendance/EmployeeAttendance";
import { EmployeeDocuments } from "./EmployeeDocuments/EmployeeDocuments";
import { EmployeeProfile } from "./EmployeeProfile/EmployeeProfile";
import { EmployeeWorkPost } from "./EmployeeWorkPost/EmployeeWorkPost";
import { FamilyDetails } from "./FamilyDetails/FamilyDetails";
import { Finances } from "./Finances/Finances";
import type { OptionKey } from "./hooks/useTabsOptions";
import { useTabOptions } from "./hooks/useTabsOptions";
import { InsuranceDetail } from "./InsuranceDetails/InsuranceDetail";
import { LeaveDetailsSection } from "./LeaveDetailsSection/LeaveDetailsSection";
import { PastWorkEmployment } from "./PastWorkEmployment/PastWorkEmployment";

type TabsProps = Readonly<{
  employeeId: string;
  view: ButtonViewTypeKeys;
}>;

export function Tabs({ employeeId, view }: TabsProps) {
  const { menuItems } = useTabOptions({ employeeId, view });

  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");

  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  const categoryRenderer: Record<OptionKey, ReactNode> = {
    "employee-profile": <EmployeeProfile employeeId={employeeId} />,
    "family-details": <FamilyDetails employeeId={employeeId} />,
    "past-work-employment": <PastWorkEmployment employeeId={employeeId} />,
    "org-post-policy": <EmployeeWorkPost employeeId={employeeId} view={view} />,
    "insurance-details": <InsuranceDetail employeeId={employeeId} />,
    attendance: <EmployeeAttendance employeeId={employeeId} />,
    leave: <LeaveDetailsSection employeeId={employeeId} />,
    finances: <Finances employeeId={employeeId} view={view} />,
    "employee-documents": (
      <EmployeeDocuments employeeId={employeeId} view={view} />
    ),
  };

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
            label={item.title}
            onClick={item.onClick}
          />
        ))}
      </MuiTabs>
      {tab && categoryRenderer[tab as OptionKey]}
    </>
  );
}

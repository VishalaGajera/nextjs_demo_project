"use client";

import { Tabs as MuiTabs, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useSearchParams } from "next/navigation";
import { useTabOptions } from "./hooks/useTabOptions";

type AttendanceSummaryTabsProps = Readonly<{
  employeeId: string;
}>;

export function AttendanceSummaryTab({
  employeeId,
}: AttendanceSummaryTabsProps) {
  const { menuItems } = useTabOptions({ employeeId });

  const searchParams = useSearchParams();

  const tab = searchParams.get("type");

  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  return (
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
  );
}

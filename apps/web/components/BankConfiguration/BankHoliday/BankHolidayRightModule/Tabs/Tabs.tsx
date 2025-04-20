"use client";

import { Tabs as MuiTabs } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useSearchParams } from "next/navigation";
import { useTabOptions } from "./hooks/useTabOptions";

export function Tabs({
  bankHolidayYears,
}: Readonly<{
  bankHolidayYears: { year: string }[];
}>) {
  const searchParams = useSearchParams();

  const companyId = searchParams.get("tab") ?? "";

  const year = searchParams.get("year");

  const { menuItems } = useTabOptions({ companyId, bankHolidayYears });

  return (
    <MuiTabs value={year} aria-label="secondary tabs example ">
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

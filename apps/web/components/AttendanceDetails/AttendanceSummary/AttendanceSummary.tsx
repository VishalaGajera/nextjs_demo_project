"use client";

import { PadBox } from "@codezee/sixtify-brahma";
import { Box, useTheme } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { type ReactNode } from "react";
import { AttendanceSummaryTab } from "./AttendanceSummaryTabs/AttendanceSummaryTabs";
import { EmployeeSummaryCards } from "./AttendanceSummaryTabs/EmployeeSummaryCards/EmployeeSummaryCards";
import type { OptionKey } from "./AttendanceSummaryTabs/hooks/useTabOptions";
import type { AttendanceDetails } from "./hooks/type";

type AttendanceSummaryProps = {
  employeeData: AttendanceDetails;
  employeeId: string;
  isLoading: boolean;
};

export function AttendanceSummary({
  employeeData,
  employeeId,
  isLoading,
}: Readonly<AttendanceSummaryProps>) {
  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  const searchParams = useSearchParams();

  const tab = searchParams.get("type");

  const categoryRenderer: Record<OptionKey, ReactNode> = {
    day: (
      <EmployeeSummaryCards
        cardData={employeeData.summary?.day}
        type="Days"
        isLoading={isLoading}
      />
    ),
    hours: (
      <EmployeeSummaryCards
        cardData={employeeData.summary?.hours}
        type="Hours"
        isLoading={isLoading}
      />
    ),
  };

  return (
    <Box bgcolor={lightBlue[50]} sx={{ borderRadius: "5px" }}>
      <PadBox padding={{ padding: 1 }}>
        <AttendanceSummaryTab employeeId={employeeId} />

        {tab && categoryRenderer[tab as OptionKey]}
      </PadBox>
    </Box>
  );
}

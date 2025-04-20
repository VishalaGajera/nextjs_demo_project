"use client";

import { Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { EditFlexiShift } from "../../../../../../components/EmployeeManagement/Employee/Shifts/Shift/FlexiShift/EditFlexiShift/EditFlexiShift";
import { FlexiShiftBreadcrumb } from "../../../../../../components/EmployeeManagement/Employee/Shifts/Shift/FlexiShift/FlexiShiftBreadcrumb";
import { ViewFlexiShift } from "../../../../../../components/EmployeeManagement/Employee/Shifts/Shift/FlexiShift/ViewFlexiShift/ViewFlexiShift";
export type PageProps = Readonly<{
  params: {
    shiftId: string;
  };
}>;

export type ShiftFlexiComponents = Record<string, ReactNode>;

export default function Page({ params }: Readonly<PageProps>) {
  const { shiftId } = params;

  const type = useSearchParams().get("type") ?? "";

  const shiftFlexiComponents: ShiftFlexiComponents = {
    view: <ViewFlexiShift shiftId={shiftId} />,
    edit: <EditFlexiShift shiftId={shiftId} />,
  };

  return (
    <Stack gap="15px">
      <FlexiShiftBreadcrumb />

      {type && shiftFlexiComponents[type]}
    </Stack>
  );
}

"use client";

import { Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { AutoShiftBreadcrumb } from "../../../../../../components/EmployeeManagement/Employee/Shifts/Shift/AutoShift/AutoShiftBreadcrumb";
import { EditAutoShift } from "../../../../../../components/EmployeeManagement/Employee/Shifts/Shift/AutoShift/EditAutoShift/EditAutoShift";
import { ViewAutoShift } from "../../../../../../components/EmployeeManagement/Employee/Shifts/Shift/AutoShift/ViewAutoShift/ViewAutoShift";

export type PageProps = {
  params: {
    shiftId: string;
  };
};

export type ShiftFixedComponents = Record<string, ReactNode>;

export default function Page({ params }: Readonly<PageProps>) {
  const { shiftId } = params;

  const type = useSearchParams().get("type") ?? "";

  const shiftFixedComponents: ShiftFixedComponents = {
    view: <ViewAutoShift shiftId={shiftId} />,
    edit: <EditAutoShift shiftId={shiftId} />,
  };

  return (
    <Stack gap="15px">
      <AutoShiftBreadcrumb />

      {type && shiftFixedComponents[type]}
    </Stack>
  );
}

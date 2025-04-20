"use client";

import { Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { EditFixedShift } from "../../../../../../components/EmployeeManagement/Employee/Shifts/Shift/FixedShift/EditFixedShift/EditFixedShift";
import { FixedShiftBreadcrumb } from "../../../../../../components/EmployeeManagement/Employee/Shifts/Shift/FixedShift/FixedShiftBreadcrumb";
import { ViewFixedShift } from "../../../../../../components/EmployeeManagement/Employee/Shifts/Shift/FixedShift/ViewFixedShift/ViewFixedShift";

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
    view: <ViewFixedShift shiftId={shiftId} />,
    edit: <EditFixedShift shiftId={shiftId} />,
  };

  return (
    <Stack gap="15px">
      <FixedShiftBreadcrumb />

      {type && shiftFixedComponents[type]}
    </Stack>
  );
}

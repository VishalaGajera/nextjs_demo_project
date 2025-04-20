"use client";

import { Stack } from "@mui/material";
import { AddAutoShift } from "../../../../../components/EmployeeManagement/Employee/Shifts/Shift/AutoShift/AddAutoShift/AddAutoShift";
import { AutoShiftBreadcrumb } from "../../../../../components/EmployeeManagement/Employee/Shifts/Shift/AutoShift/AutoShiftBreadcrumb";

export default function AutoShift() {
  return (
    <Stack gap="15px">
      <AutoShiftBreadcrumb />

      <AddAutoShift />
    </Stack>
  );
}

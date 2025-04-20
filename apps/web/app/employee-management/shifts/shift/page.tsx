"use client";

import { Stack } from "@mui/material";
import { ShiftDetailBreadcrumb } from "../../../../components/EmployeeManagement/Employee/Shifts/Shift/ShiftDetailBreadcrumb";
import { ShiftDetailCard } from "../../../../components/EmployeeManagement/Employee/Shifts/Shift/ShiftDetailCard";

export default function Shift() {
  return (
    <Stack gap="10px">
      <ShiftDetailBreadcrumb />
      <ShiftDetailCard />
    </Stack>
  );
}

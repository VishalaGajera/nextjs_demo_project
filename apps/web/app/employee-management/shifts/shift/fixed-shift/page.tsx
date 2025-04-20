import { Stack } from "@mui/material";
import { AddFixedShift } from "../../../../../components/EmployeeManagement/Employee/Shifts/Shift/FixedShift/AddFixedShift/AddFixedShift";
import { FixedShiftBreadcrumb } from "../../../../../components/EmployeeManagement/Employee/Shifts/Shift/FixedShift/FixedShiftBreadcrumb";

export default function FixedShift() {
  return (
    <Stack gap="15px">
      <FixedShiftBreadcrumb />
      <AddFixedShift />
    </Stack>
  );
}

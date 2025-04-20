import { Stack } from "@mui/material";
import { AddFlexiShift } from "../../../../../components/EmployeeManagement/Employee/Shifts/Shift/FlexiShift/AddFlexiShift/AddFlexiShift";
import { FlexiShiftBreadcrumb } from "../../../../../components/EmployeeManagement/Employee/Shifts/Shift/FlexiShift/FlexiShiftBreadcrumb";
export default function FlexiShift() {
  return (
    <Stack gap="15px">
      <FlexiShiftBreadcrumb />
      <AddFlexiShift />
    </Stack>
  );
}

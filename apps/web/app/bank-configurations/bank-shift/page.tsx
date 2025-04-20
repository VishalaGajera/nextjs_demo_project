import { Stack } from "@mui/material";
import { BankShiftBreadcrumb } from "../../../components/EmployeeManagement/Employee/Shifts/BankShift/BankShiftBreadcrumb";
import { BankShiftDetailCard } from "../../../components/EmployeeManagement/Employee/Shifts/BankShift/BankShiftDetailCard/BankShiftDetailCard";

export default function BankShift() {
  return (
    <Stack gap="10px">
      <BankShiftBreadcrumb />

      <BankShiftDetailCard />
    </Stack>
  );
}

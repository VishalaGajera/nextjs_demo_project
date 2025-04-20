"use client";

import { Stack } from "@mui/material";
import BankShiftAllocationBreadcrumbs from "../../../components/Transactions/ShiftDay/BankShiftAllocation/BankShiftAllocationBreadcrumbs";
import { BankShiftAllocationDetails } from "../../../components/Transactions/ShiftDay/BankShiftAllocation/BankShiftAllocationDetails";

export default function Page() {
  return (
    <Stack gap="10px">
      <BankShiftAllocationBreadcrumbs />

      <BankShiftAllocationDetails />
    </Stack>
  );
}

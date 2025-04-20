"use client";

import { Stack } from "@mui/material";
import { AdvanceAndReceive } from "../../../../components/Payroll/PayrollTransaction/AdvanceAndReceive/AdvanceAndReceive";
import { AdvanceAndReceiveBreadCrumbs } from "../../../../components/Payroll/PayrollTransaction/AdvanceAndReceive/AdvanceAndReceiveBreadCrumbs";

export default function Page() {
  return (
    <Stack gap="10px">
      <AdvanceAndReceiveBreadCrumbs />

      <AdvanceAndReceive />
    </Stack>
  );
}

"use client";

import { Stack } from "@mui/material";
import { Tabs } from "../../../../components/Payroll/Settings/TaxesAndDeductions/Tabs/Tabs";
import { TaxesAndDeductionsBreadCrumbs } from "../../../../components/Payroll/Settings/TaxesAndDeductions/TaxesAndDeductionsBreadCrumbs";

export default function Page() {
  return (
    <Stack gap="10px">
      <TaxesAndDeductionsBreadCrumbs />

      <Tabs />
    </Stack>
  );
}

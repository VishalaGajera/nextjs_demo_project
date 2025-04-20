"use client";

import { Stack } from "@mui/material";
import { SalaryComponentsBreadCrumbs } from "../../../../components/Payroll/Settings/SalaryComponents/SalaryComponentsBreadCrumbs";
import { Tabs } from "../../../../components/Payroll/Settings/SalaryComponents/Tabs/Tabs";

export default function Page() {
  return (
    <Stack gap="10px">
      <SalaryComponentsBreadCrumbs />

      <Tabs />
    </Stack>
  );
}

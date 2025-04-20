"use client";

import { Stack } from "@mui/material";
import { SalaryStructure } from "../../../../components/Payroll/Settings/SalaryStructure/SalaryStructure";
import { SalaryStructureBreadCrumbs } from "../../../../components/Payroll/Settings/SalaryStructure/SalaryStructureBreadCrumbs";

export default function Page() {
  return (
    <Stack gap="10px">
      <SalaryStructureBreadCrumbs />

      <SalaryStructure />
    </Stack>
  );
}

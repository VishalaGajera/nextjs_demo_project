"use client";

import { Stack } from "@mui/material";
import { SalaryStructureDetails } from "../../../../../../components/Payroll/Settings/SalaryStructure/SalaryStructureDetails/SalaryStructureDetails";
import { SalaryStructureDetailsBreadCrumbs } from "../../../../../../components/Payroll/Settings/SalaryStructure/SalaryStructureDetails/SalaryStructureDetailsBreadCrumbs";

export default function Page() {
  return (
    <Stack gap="15px">
      <SalaryStructureDetailsBreadCrumbs />

      <SalaryStructureDetails />
    </Stack>
  );
}

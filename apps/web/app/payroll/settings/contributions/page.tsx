"use client";

import { Stack } from "@mui/material";
import { ContributionsBreadCrumbs } from "../../../../components/Payroll/Settings/Contributions/ContributionsBreadCrumbs";
import { Tabs } from "../../../../components/Payroll/Settings/Contributions/Tabs/Tabs";

export default function Page() {
  return (
    <Stack gap="10px">
      <ContributionsBreadCrumbs />

      <Tabs />
    </Stack>
  );
}

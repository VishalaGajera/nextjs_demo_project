"use client";

import { Stack } from "@mui/material";
import { LeaveDetails } from "../../../../../../../components/Transactions/Leave/LeaveOverview/LeaveDetails/LeaveDetails";
import { LeaveDetailsBreadCrumbs } from "../../../../../../../components/Transactions/Leave/LeaveOverview/LeaveOverviewDetailsBreadCrumbs";

export default function Page() {
  return (
    <Stack gap="10px">
      <LeaveDetailsBreadCrumbs />

      <LeaveDetails />
    </Stack>
  );
}

"use client";

import { Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { BankHolidayBreadcrumbs } from "../../../components/BankConfiguration/BankHoliday/BankHolidayBreadcrumbs";
import { BankHolidayGroupSidebar } from "../../../components/BankConfiguration/BankHoliday/BankHolidayGroupSidebar/BankHolidayGroupSidebar";
import { BankHolidayRightModule } from "../../../components/BankConfiguration/BankHoliday/BankHolidayRightModule/BankHolidayRightModule";

export default function Page() {
  const searchParams = useSearchParams();

  const companyId = searchParams.get("tab") ?? "";

  return (
    <Stack gap="20px">
      <BankHolidayBreadcrumbs />

      <Stack direction="row" gap="25px" sx={{ flex: 1 }}>
        <BankHolidayGroupSidebar />

        {companyId && <BankHolidayRightModule companyId={companyId} />}
      </Stack>
    </Stack>
  );
}

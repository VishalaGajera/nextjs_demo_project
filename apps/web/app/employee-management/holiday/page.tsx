"use client";

import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { HolidayGroupSidebar } from "../../../components/EmployeeManagement/Holiday/HolidayGroupSideBar/HolidayGroupSidebar";
import { HolidayRightModule } from "../../../components/EmployeeManagement/Holiday/HolidayRightModule/HolidayRightModule";

export default function Page() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const holidayGroupId = searchParams.get("tab") ?? "";

  const year = searchParams.get("year") ?? "";

  return (
    <Stack gap="20px">
      <Breadcrumbs
        items={[
          {
            icon: <SvgsHome />,
            onClick: () => router.push("/"),
          },
          {
            text: "Employee Management",
          },
          {
            text: "Holiday",
          },
        ]}
      />

      <Stack direction="row" gap="25px" sx={{ flex: 1 }}>
        <HolidayGroupSidebar holidayGroupId={holidayGroupId} />
        {holidayGroupId && (
          <HolidayRightModule holidayGroupId={holidayGroupId} year={year} />
        )}
      </Stack>
    </Stack>
  );
}

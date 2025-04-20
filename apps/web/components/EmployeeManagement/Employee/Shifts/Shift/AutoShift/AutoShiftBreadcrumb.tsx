"use client";

import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { useRouter, useSearchParams } from "next/navigation";

export const AutoShiftBreadcrumb = () => {
  const router = useRouter();

  const type = useSearchParams().get("type") ?? "";

  const getShiftType = (type: string) => {
    switch (type) {
      case "view":
        return "View Auto Shift";

      case "edit":
        return "Edit Auto Shift";

      case "add":
        return "Add Auto Shift";

      default:
        return "Add Auto Shift";
    }
  };

  return (
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
          text: "Shifts",
        },
        {
          text: "Shift",
          onClick: () => router.push("/employee-management/shifts/shift"),
        },
        {
          text: getShiftType(type),
        },
      ]}
    />
  );
};

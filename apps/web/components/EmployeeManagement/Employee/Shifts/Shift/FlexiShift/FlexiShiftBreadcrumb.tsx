"use client";

import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { useRouter, useSearchParams } from "next/navigation";

export const FlexiShiftBreadcrumb = () => {
  const router = useRouter();

  const type = useSearchParams().get("type") ?? "";

  const getShiftType = (type: string) => {
    switch (type) {
      case "view":
        return "View flexi Shift";

      case "edit":
        return "Edit flexi Shift";

      case "add":
        return "Add flexi Shift";

      default:
        return "Add flexi Shift";
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
          onClick: () => router.push("/employee-management/shifts/shift"),
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

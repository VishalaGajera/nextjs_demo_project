"use client";

import { Breadcrumbs, Card, PadBox, SvgsHome } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { EditWeeklyOffs } from "../../../../components/EmployeeManagement/WeeklyOffs/EditWeeklyOffs/EditWeeklyOffs";
import { ViewWeeklyOffs } from "../../../../components/EmployeeManagement/WeeklyOffs/ViewWeeklyOffs/ViewWeeklyOffs";

export type PageProps = Readonly<{
  params: {
    weeklyOffId: string;
  };
}>;

export type weeklyOffsTypes = Record<string, ReactNode>;

export default function Page({ params }: Readonly<PageProps>) {
  const router = useRouter();

  const { weeklyOffId } = params;

  const type = useSearchParams().get("type") ?? "";

  const weeklyOffsComponents: weeklyOffsTypes = {
    view: <ViewWeeklyOffs weeklyOffId={weeklyOffId} />,
    edit: <EditWeeklyOffs weeklyOffId={weeklyOffId} />,
  };

  const getWeeklyOffsBreadcrumbsType = (type: string) => {
    switch (type) {
      case "view":
        return "View Weekly Offs";

      case "edit":
        return "Edit Weekly Offs";

      default:
        return "Add Weekly Offs";
    }
  };

  return (
    <Stack gap="10px">
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
            text: "Weekly Offs",
            onClick: () => router.push("/employee-management/weekly-offs"),
          },
          {
            text: getWeeklyOffsBreadcrumbsType(type),
          },
        ]}
      />

      <Card heading="Weekly Offs">
        <PadBox padding={{ padding: "15px" }}>
          {type && weeklyOffsComponents[type]}
        </PadBox>
      </Card>
    </Stack>
  );
}

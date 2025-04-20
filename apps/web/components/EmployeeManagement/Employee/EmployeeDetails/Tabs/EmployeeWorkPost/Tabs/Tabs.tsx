"use client";

import { Tabs as MuiTabs, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useSearchParams } from "next/navigation";
import { type ReactNode } from "react";
import { OrganizationDetails } from "./EmployeeOrganizationDetails/OrganizationDetails";
import type { ButtonViewTypeKeys } from "../../../../../../../app/employee-management/employee/hooks/useGetButtonOptions";
import { PostDetails } from "./EmployeePostDetails/PostDetails";
import type { OptionKey } from "./hooks/useTabOptions";
import { useTabOptions } from "./hooks/useTabOptions";
import { SchemaDetails } from "./EmployeeSchemaDetails/SchemaDetails";
import { useGetEmployeeOrganizationSectionDetail } from "./EmployeeOrganizationDetails/hooks/useGetOrganizationSectionDetail";

type TabsArgs = Readonly<{
  employeeId: Readonly<string>;
  view: ButtonViewTypeKeys;
}>;

export function Tabs({ employeeId, view }: TabsArgs) {
  const { menuItems } = useTabOptions({ employeeId, view });

  const { data: companyDetail, isPending } =
    useGetEmployeeOrganizationSectionDetail({
      employeeId,
      section: "company",
    });

  const searchParams = useSearchParams();

  const tab = searchParams.get("subtab");

  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  const categoryRenderer: Record<OptionKey, ReactNode> = {
    "organization-details": (
      <OrganizationDetails loading={isPending} employeeId={employeeId} />
    ),
    "post-details": (
      <PostDetails
        loading={isPending}
        employeeId={employeeId}
        companyId={companyDetail?.id ?? ""}
      />
    ),
    "policy-details": (
      <SchemaDetails
        loading={isPending}
        companyId={companyDetail?.id ?? ""}
        employeeId={employeeId}
      />
    ),
  };

  return (
    <>
      <MuiTabs
        value={tab}
        aria-label="secondary tabs example "
        sx={{
          marginBottom: "15px",
          bgcolor: lightBlue[50],
        }}
      >
        {menuItems.map((item) => (
          <Tab
            key={item.value}
            value={item.value}
            label={item.title}
            onClick={item.onClick}
          />
        ))}
      </MuiTabs>
      {tab && categoryRenderer[tab as OptionKey]}
    </>
  );
}

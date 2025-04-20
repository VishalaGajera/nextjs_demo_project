"use client";

import { Tabs as MuiTabs, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useSearchParams } from "next/navigation";
import { type ReactNode } from "react";
import type { PageProps } from "../../../../../app/organization/company/[companyId]/page";
import { AuthorisedPersonDetails } from "./AuthorisedPersonDetails/AuthorisedPersonDetails";
import { BasicDetails } from "./BasicDetails/BasicDetails";
import { DirectorDetails } from "./DirectorsDetails/DirectorsDetails";
import type { OptionKey } from "./hooks/useTabsOptions";
import { useTabOptions } from "./hooks/useTabsOptions";
import { StatutoryDetailsCard } from "./StatutoryDetails/StatutoryDetailsCard/StatutoryDetailsCard";

type TabsProps = Readonly<PageProps["params"]>;

export function Tabs({ companyId }: TabsProps) {
  const { menuItems } = useTabOptions({ companyId });

  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");

  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  const categoryRenderer: Record<OptionKey, ReactNode> = {
    "basic-details": <BasicDetails companyId={companyId} />,
    "statutory-details": <StatutoryDetailsCard companyId={companyId} />,
    "director-details": <DirectorDetails companyId={companyId} />,
    "authorised-person-details": (
      <AuthorisedPersonDetails companyId={companyId} />
    ),
  };

  return (
    <>
      <MuiTabs
        value={tab}
        aria-label="secondary tabs example "
        sx={{
          borderRadius: "5px",
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

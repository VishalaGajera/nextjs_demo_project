"use client";

import { Box, Tabs as MuiTabs, Stack, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { Contribution } from "../Contribution/Contribution";
import { Deduction } from "../Deduction/Deduction";
import { Earning } from "../Earning/Earning";
import { Reimbursement } from "../Reimbursement/Reimbursement";
import type { OptionKey } from "./hooks/useTabsOptions";
import { categories, useTabOptions } from "./hooks/useTabsOptions";

export function Tabs() {
  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  const { menuItems } = useTabOptions();

  const searchParams = useSearchParams();

  const categoryRenderer: Record<OptionKey, ReactNode> = {
    earning: <Earning />,
    deduction: <Deduction />,
    contribution: <Contribution />,
    reimbursement: <Reimbursement />,
  };

  const tab = searchParams.get("tab");

  const router = useRouter();

  if (!tab || !Object.keys(categories).includes(tab)) {
    router.replace("/payroll/settings/salary-components?tab=earning");

    return <></>;
  }

  return (
    <Stack gap="10px">
      <Stack bgcolor={lightBlue[50]} borderRadius="5px">
        <MuiTabs
          value={tab}
          aria-label="secondary tabs example "
          sx={{
            borderRadius: "5px",
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
      </Stack>

      <Box bgcolor={lightBlue[50]} sx={{ borderRadius: "5px" }}>
        {tab && categoryRenderer[tab as OptionKey]}
      </Box>
    </Stack>
  );
}

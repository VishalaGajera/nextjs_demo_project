"use client";

import { Box, Tabs as MuiTabs, Stack, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { LabourWelfareFundBody } from "../LabourWelfareFund/LabourWelfareFundBody";
import { ESICInfo } from "./ESIC/ESICInfo";
import { GratuityTab } from "./Gratuity/GratuityTab";
import {
  categories,
  useTabOptions,
  type OptionKey,
} from "./hooks/useTabsOptions";
import { ProvidentFund } from "./ProvidentFund/ProvidentFund";
export const Tabs = () => {
  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  const { menuItems } = useTabOptions();

  const searchParams = useSearchParams();

  const categoryRenderer: Record<OptionKey, ReactNode> = {
    pf: <ProvidentFund />,
    esic: <ESICInfo />,
    lwf: <LabourWelfareFundBody />,
    gratuity: <GratuityTab />,
  };

  const tab = searchParams.get("tab");

  const router = useRouter();

  if (!tab || !Object.keys(categories).includes(tab)) {
    router.replace("/payroll/settings/contributions?tab=pf");

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
};

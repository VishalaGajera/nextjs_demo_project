"use client";

import { Box, Tabs as MuiTabs, Stack, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { InvestmentSchemes } from "../InvestmentSchemes/InvestmentSchemes";
import { TaxSections } from "../TaxSections/TaxSections";
import type { SubOptionKey } from "./hooks/useSubTabsOptions";
import { subCategories, useSubTabOptions } from "./hooks/useSubTabsOptions";

export const SubTabs = () => {
  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  const { menuItems } = useSubTabOptions();

  const searchParams = useSearchParams();

  const categoryRenderer: Record<SubOptionKey, ReactNode> = {
    "tax-sections": <TaxSections />,
    "investment-schemes": <InvestmentSchemes />,
  };

  const subTab = searchParams.get("subtab");

  const router = useRouter();

  if (!subTab || !Object.keys(subCategories).includes(subTab)) {
    router.replace(
      "/payroll/settings/taxes-deductions?tab=investment-deduction&subtab=tax-sections"
    );

    return <></>;
  }

  return (
    <Stack gap="10px">
      <Stack bgcolor={lightBlue[50]} borderRadius="5px">
        <MuiTabs
          value={subTab}
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
        {subTab && categoryRenderer[subTab as SubOptionKey]}
      </Box>
    </Stack>
  );
};

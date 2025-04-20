"use client";

import { SvgCalendar } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import type { ReactNode } from "react";
import type { LeavePlanListData } from "./hooks/useGetLeavePlanList";

type LeavePlanCardProps = Readonly<{
  actions: ReactNode;
  selected: boolean;
  onClick: () => void;
  item: LeavePlanListData;
}>;

export function LeavePlanCard({
  actions,
  selected,
  onClick,
  item,
}: LeavePlanCardProps) {
  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  return (
    <Box
      border="1px solid"
      borderRadius="5px"
      borderColor={iron[700]}
      sx={{
        cursor: "pointer",
        borderLeftColor: selected ? butterflyBlue[900] : iron[700],
      }}
      borderLeft={selected ? "5px solid" : "1px solid"}
    >
      <Stack
        gap="5px"
        padding="10px"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Stack gap="5px" onClick={onClick} width="100%">
          <Typography variant="body2">{item.leave_plan_name}</Typography>

          <Typography variant="caption" color={iron[800]}>
            {item.company_name}
          </Typography>

          <Stack flexDirection="row" alignItems="center">
            <SvgCalendar style={{ color: iron[800] }} />

            <Typography variant="caption" color={iron[800]}>
              {item.year_cycle}
            </Typography>
          </Stack>
        </Stack>

        {actions}
      </Stack>
    </Box>
  );
}

"use client";

import { PadBox } from "@codezee/sixtify-brahma";
import { Box, Stack } from "@mui/material";
import { useState, type PropsWithChildren } from "react";
import { Drawer } from "../Drawer/Drawer";
import { Header } from "../Header/Header";

export function PrivatePageLayout({ children }: Readonly<PropsWithChildren>) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  return (
    <Stack direction="row">
      <Drawer open={isDrawerOpen} />

      <Stack spacing="64px" flexGrow={1} sx={{ overflow: "hidden" }}>
        <Header isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
          }}
        >
          <PadBox padding={{ padding: "15px 30px" }}>{children}</PadBox>
        </Box>
      </Stack>
    </Stack>
  );
}

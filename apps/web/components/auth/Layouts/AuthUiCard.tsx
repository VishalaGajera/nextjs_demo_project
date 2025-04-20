import { PadBox } from "@codezee/sixtify-brahma";
import { Box, Stack, useTheme } from "@mui/material";
import type { PropsWithChildren } from "react";

export const AuthUiCard = ({ children }: PropsWithChildren) => {
  const {
    palette: {
      app: { color },
    },
  } = useTheme();

  return (
    <Box
      sx={{
        background: color.iron[600],
        boxShadow: `12px 10px 25px ${color.mirage[800]}`,
        borderRadius: "20px",
        maxWidth: "630px",
        margin: "auto",
      }}
    >
      <PadBox padding={{ padding: "50px 75px" }}>
        <Stack gap="50px" alignItems="center">
          {children}
        </Stack>
      </PadBox>
    </Box>
  );
};

import { Divider, Stack, Typography, useTheme } from "@mui/material";
import type { PropsWithChildren } from "react";

type CardSectionProps = PropsWithChildren<{
  title: string;
  isDivider?: boolean;
}>;

export const CardSection = ({
  title,
  children,
  isDivider = false,
}: CardSectionProps) => {
  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  return (
    <Stack gap="10px">
      <Typography
        sx={{
          color: butterflyBlue[900],
        }}
      >
        {title}
      </Typography>

      {children}
      {isDivider && <Divider sx={{ color: "#E6EDEF" }} />}
    </Stack>
  );
};

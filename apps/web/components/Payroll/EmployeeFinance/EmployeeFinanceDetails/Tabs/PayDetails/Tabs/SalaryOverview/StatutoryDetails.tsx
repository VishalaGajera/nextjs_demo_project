import { Stack, Typography, useTheme } from "@mui/material";
import type { ReactNode } from "react";

type StatutoryDetailsProps = {
  header: string;
  label?: string;
  icon: ReactNode;
  isLabelVisible?: boolean;
};

export const StatutoryDetails = ({
  header,
  label,
  isLabelVisible = true,
  icon,
}: StatutoryDetailsProps) => {
  const theme = useTheme();

  const { mirage, slate } = theme.palette.app.color;

  return (
    <Stack direction="row" gap="30px">
      <Stack direction="row" gap="5px" alignItems="start">
        {icon}

        <Stack justifyContent="start">
          <Typography
            variant="h6"
            sx={{ fontSize: "14px", color: mirage[900] }}
          >
            {header}
          </Typography>

          {isLabelVisible && label && (
            <Typography
              variant="body2"
              sx={{ fontSize: "12px", color: slate[900] }}
            >
              {label}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

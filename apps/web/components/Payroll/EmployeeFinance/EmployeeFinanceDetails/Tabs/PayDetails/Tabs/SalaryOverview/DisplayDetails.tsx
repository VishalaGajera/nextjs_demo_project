import { Stack, Typography, useTheme } from "@mui/material";

type DisplayDetailsProps = {
  label: string | number;
  header: string;
};

export const DisplayDetails = ({ header, label }: DisplayDetailsProps) => {
  const theme = useTheme();

  const { slate, mirage } = theme.palette.app.color;

  return (
    <Stack direction="row" gap="5px">
      <Typography
        sx={{ textWrap: "nowrap", color: mirage[900] }}
        variant="body1"
        fontWeight={500}
      >
        {header}
      </Typography>

      <Typography noWrap sx={{ color: slate[900] }} variant="body1">
        {label}
      </Typography>
    </Stack>
  );
};

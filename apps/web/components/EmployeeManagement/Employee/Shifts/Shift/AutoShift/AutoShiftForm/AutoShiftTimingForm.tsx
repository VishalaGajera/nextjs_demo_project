import { Stack, Typography } from "@mui/material";
import { AutoShiftTimingRow } from "./AutoShiftTimingRow";

export const AutoShiftTimingForm = () => {
  const headerList = [
    {
      label: "Shift From Time",
    },
    {
      label: "Shift To Time",
    },
    {
      label: "Shift Gross Hours",
    },
    {
      label: "Break From Time",
    },
    {
      label: "Break To Time",
    },
    {
      label: "Break Gross Hours",
    },
    {
      label: "Effective Work Hours",
    },
  ];

  return (
    <Stack spacing={2}>
      <Stack direction="row" gap="10px" sx={{ width: "100%" }}>
        {headerList.map((item) => {
          return (
            <Typography
              key={item.label}
              width="100%"
              maxWidth="250px"
              fontWeight="bold"
            >
              {item.label}
            </Typography>
          );
        })}
      </Stack>

      <AutoShiftTimingRow />
    </Stack>
  );
};

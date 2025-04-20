import { Stack, Typography } from "@mui/material";
import { AutoShiftDefaultTimingRow } from "./AutoShiftDefaultTimingRow";
import type { ShiftFormProps } from "./AutoShiftForm";

export const AutoShiftDefaultTimingForm = ({
  loading,
  disabled = false,
}: ShiftFormProps) => {
  const headerList = [
    "Shift From Time",
    "Shift To Time",
    "Shift Gross Hours",
    "Break From Time",
    "Break To Time",
    "Break Gross Hours",
    "Effective Work Hours",
  ];

  return (
    <Stack spacing={2}>
      <Stack direction="row" gap="10px" sx={{ width: "100%" }}>
        {headerList.map((item) => {
          return (
            <Typography
              key={item}
              width="100%"
              maxWidth="250px"
              fontWeight="bold"
            >
              {item}
            </Typography>
          );
        })}
      </Stack>

      <AutoShiftDefaultTimingRow loading={loading} disabled={disabled} />
    </Stack>
  );
};

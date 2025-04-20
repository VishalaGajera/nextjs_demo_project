import { Stack, Typography } from "@mui/material";
import type { DayOfWeek } from "./FixedShiftForm";
import { FixedShiftTimingRow } from "./FixedShiftTimingRow";

const daysOfWeek: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

type FixedShiftTimingFormProps = {
  loading: boolean;
  disabled?: boolean;
};

export const FixedShiftTimingForm = ({
  loading,
  disabled = false,
}: FixedShiftTimingFormProps) => {
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
        <Typography width="100%" maxWidth="180px" fontWeight="bold">
          Working Day
        </Typography>

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

      {daysOfWeek.map((day: DayOfWeek) => (
        <FixedShiftTimingRow
          key={day}
          day={day}
          loading={loading}
          disabled={disabled}
        />
      ))}
    </Stack>
  );
};

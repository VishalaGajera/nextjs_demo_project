import { PadBox } from "@codezee/sixtify-brahma";
import { Grid, Stack, Typography } from "@mui/material";
import type { DayOfWeek } from "./BankShiftForm";
import { BankShiftRow } from "./BankShiftRow";

const daysOfWeek: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const headers = [
  "Working Day",
  "Bank Shift From Time",
  "Bank Shift To Time",
  "Shift Gross Hours",
  "Break From Time",
  "Break To Time",
  "Break Gross Hours",
  "Effective Work Hours",
];

type BankShiftTimingProps = {
  loading: boolean;
  disabled?: boolean;
};

export const BankShiftTimingForm = ({
  loading,
  disabled = false,
}: BankShiftTimingProps) => {
  return (
    <Stack gap="15px">
      <PadBox padding={{ paddingTop: "10px" }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Bank Shift Timings
        </Typography>
      </PadBox>

      <Stack gap="10px" justifyContent="center">
        <Grid
          container
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          {headers.map((header) => (
            <Grid key={header} item xs={1.5}>
              <Typography
                variant="subtitle2"
                textTransform="capitalize"
                fontWeight={600}
              >
                {header}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {daysOfWeek.map((day: DayOfWeek) => (
          <BankShiftRow
            key={day}
            day={day}
            loading={loading}
            disabled={disabled}
          />
        ))}
      </Stack>
    </Stack>
  );
};

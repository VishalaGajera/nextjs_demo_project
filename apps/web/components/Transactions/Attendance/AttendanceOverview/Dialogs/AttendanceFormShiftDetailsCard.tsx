import { getTimeInHHmm, PadBox } from "@codezee/sixtify-brahma";
import { Box, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import { getShiftTypeLabel } from "../../../../common/Autocomplete/ShiftSchemeAutocomplete";
import type { AttendanceLogs, AutoShiftType } from "./hooks/type";

type AttendanceFormShiftDetailsCardProps = {
  data: AttendanceLogs;
  isFetching: boolean;
  autoAssignData: AutoShiftType | null;
  shiftType: string;
};

export const getLabelColor = (status: string | null, type?: string) => {
  const index = type === "dark" ? 900 : 600;

  const theme = useTheme();

  const { sapphireBlue, darkOrange, slate } = theme.palette.app.color;

  switch (status) {
    case "holiday":
      return {
        label: "Holiday",
        color: sapphireBlue[index],
      };

    case "full_day_weekly_off":
      return {
        label: "Weekly Off",
        color: darkOrange[index],
      };

    case "first_half_weekly_off":
      return {
        label: "First Half Weekly Off",
        color: darkOrange[index],
      };

    case "second_half_weekly_off":
      return {
        label: "Second Half Weekly Off",
        color: darkOrange[index],
      };

    default:
      return { label: "", color: slate[800] };
  }
};

export const AttendanceFormShiftDetailsCard = ({
  data,
  isFetching,
  autoAssignData,
  shiftType,
}: AttendanceFormShiftDetailsCardProps) => {
  const shiftTypeLabel = getShiftTypeLabel(data.shift_type) ?? "";

  const autoShiftInOutTime =
    autoAssignData?.shift_start &&
    autoAssignData?.shift_end &&
    `${getTimeInHHmm(autoAssignData.shift_start)} - ${getTimeInHHmm(autoAssignData.shift_end)}`;

  const defaultShiftTime = `${getTimeInHHmm(data.shift_start)} - ${getTimeInHHmm(data.shift_end)}`;

  return (
    <Box
      sx={{
        border: `1px solid ${getLabelColor(data.status, "dark").color}`,
        backgroundColor: `${getLabelColor(data.status, "light").color}`,
        borderRadius: "5px",
      }}
    >
      <PadBox padding={{ padding: "15px" }}>
        <Stack flexDirection="row" justifyContent="space-between">
          <Stack flexDirection="row" gap="40px">
            <Stack gap="5px">
              <Typography variant="subtitle2">Shift </Typography>
              {isFetching ? (
                <Skeleton sx={{ width: "60px" }} />
              ) : (
                <Typography variant="body2">
                  {autoAssignData?.shift_type_name
                    ? autoAssignData.shift_type_name
                    : data.shift_type_name}
                  ({shiftTypeLabel})
                </Typography>
              )}
            </Stack>

            <Stack gap="5px">
              <Typography variant="subtitle2">Shift Time </Typography>
              {isFetching ? (
                <Skeleton sx={{ width: "60px" }} />
              ) : (
                <Typography variant="body2">
                  {shiftType === "auto"
                    ? (autoShiftInOutTime ?? defaultShiftTime)
                    : (defaultShiftTime ?? "-")}
                </Typography>
              )}
            </Stack>
          </Stack>

          {data.status && (
            <Box
              sx={{
                border: `1px solid ${getLabelColor(data.status, "dark").color}`,
                backgroundColor: "white",
                borderRadius: "5px",
                height: "min-content",
                padding: "0px 5px",
              }}
            >
              {getLabelColor(data.status).label}
            </Box>
          )}
        </Stack>
      </PadBox>
    </Box>
  );
};

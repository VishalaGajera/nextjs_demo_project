import { Box, Typography } from "@mui/material";

type UseGetBalanceRoundOfRadioOptions = { disabled?: boolean };
export function useGetBalanceRoundOfRadioOptions({
  disabled = false,
}: UseGetBalanceRoundOfRadioOptions) {
  const balanceRoundOfRadioOptions = [
    {
      label: (
        <Box>
          <Typography variant="body1" paddingTop="8px">
            Don&apos;t Round Off.
          </Typography>
        </Box>
      ),
      values: "none",
      disabled,
    },
    {
      label: (
        <Box>
          <Typography variant="body1" paddingTop="8px">
            Round Off to Nearest Half Day.
          </Typography>
        </Box>
      ),
      values: "nearest_half_day",
      disabled,
    },
    {
      label: (
        <Box>
          <Typography variant="body1" paddingTop="8px">
            Round Off to Nearest Full Day.
          </Typography>
        </Box>
      ),
      values: "nearest_full_day",
      disabled,
    },
    {
      label: (
        <Box>
          <Typography variant="body1" paddingTop="8px">
            Round Off to Ceiling Half Day.
          </Typography>
        </Box>
      ),
      values: "ceiling_half_day",
      disabled,
    },
    {
      label: (
        <Box>
          <Typography variant="body1" paddingTop="8px">
            Round Off to Ceiling Full Day.
          </Typography>
        </Box>
      ),
      values: "ceiling_full_day",
      disabled,
    },
  ];

  return { balanceRoundOfRadioOptions };
}

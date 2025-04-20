import { Box, Typography } from "@mui/material";
import { ProrateBasedOnDateSetup } from "../LeaveProrateLastMonthForm/ProrateBasedOnDateSetup";

type useGetExitingProrateQuotaRadioOptionsArgs = {
  isUnevenlyAccrued: boolean;
  accrualType: string;
  disabled: boolean;
};

export function useGetExitingProrateQuotaRadioOptions({
  isUnevenlyAccrued,
  accrualType,
  disabled = false,
}: useGetExitingProrateQuotaRadioOptionsArgs) {
  const exitingProrateQuotaRadioOptions = [
    {
      label: (
        <Box>
          <Typography variant="body1" paddingTop="8px">
            Prorate based on exit date
          </Typography>
        </Box>
      ),
      values: "based_on_exit_date",
      disabled,
    },
    ...(!isUnevenlyAccrued
      ? [
          {
            values: "based_on_range_of_date",
            label: <ProrateBasedOnDateSetup disabled={disabled} />,
            disabled,
          },
        ]
      : []),
    ...(accrualType == "periodically"
      ? [
          {
            label: (
              <Box>
                <Typography variant="body1" paddingTop="8px">
                  Do not accrue leave during notice period.
                </Typography>
              </Box>
            ),
            values: "do_not_accrual",
            disabled,
          },
        ]
      : []),
  ].filter(Boolean);

  return { exitingProrateQuotaRadioOptions };
}

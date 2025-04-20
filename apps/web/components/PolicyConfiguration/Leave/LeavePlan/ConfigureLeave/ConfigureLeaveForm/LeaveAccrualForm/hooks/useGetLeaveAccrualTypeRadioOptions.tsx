import { Typography } from "@mui/material";
import { LeavePeriodicallySetup } from "../LeavePeriodicallySetup";

type useGetLeaveAccrualTypeRadioOptionsArgs = {
  months: string[];
  unevenAccrualRatesTotal: number;
  disabled?: boolean;
};

export function useGetLeaveAccrualTypeRadioOptions({
  months,
  unevenAccrualRatesTotal,
  disabled = false,
}: useGetLeaveAccrualTypeRadioOptionsArgs) {
  const leaveAccrualTypeRadioOptions = [
    {
      label: (
        <LeavePeriodicallySetup
          months={months}
          unevenAccrualRatesTotal={unevenAccrualRatesTotal}
          disabled={disabled}
        />
      ),
      values: "periodically",
      disabled,
    },
    {
      values: "immediately",
      label: (
        <Typography variant="body1" paddingTop="8px">
          Leave accrual available Immediately
        </Typography>
      ),
      disabled,
    },
  ];

  return { leaveAccrualTypeRadioOptions };
}

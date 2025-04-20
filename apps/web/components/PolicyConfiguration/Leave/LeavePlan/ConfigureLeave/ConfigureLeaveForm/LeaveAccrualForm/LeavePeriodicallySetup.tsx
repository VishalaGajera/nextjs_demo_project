// LeavePeriodicallySetup
import { CheckBox, PadBox, TextField } from "@codezee/sixtify-brahma";
import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { useFormContext } from "react-hook-form";
import { CustomDayAutoComplete } from "../../../../../../common/Autocomplete/CustomDayAutocomplete";
import { DurationAutocompleteV2 } from "../../../../../../common/Autocomplete/DurationAutocompleteV2";
import {
  accrualRateLabel,
  accrualRateLabelV2,
  getLeaveAccrualOptions,
} from "../../hooks/helper";
import type { ConfigureLeaveFormFieldValues } from "../ConfigureLeaveForm";

type leavePeriodicallySetupProps = {
  months: string[];
  unevenAccrualRatesTotal: number;
  disabled?: boolean;
};

export const LeavePeriodicallySetup = ({
  months,
  unevenAccrualRatesTotal,
  disabled,
}: leavePeriodicallySetupProps) => {
  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<ConfigureLeaveFormFieldValues>();

  const accrualType = watch("leave_accrual.accrual_type");

  const accrualRate = watch("leave_accrual.accrual_frequency") ?? "";

  const quotaLimit = watch("leave_quota.quota_limit");

  const isUnevenlyAccrued = watch("leave_accrual.is_unevenly_accrued");

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const { accrual_frequency, initial_accrual_start_day, uneven_accrual_rates } =
    errors.leave_accrual ?? {};

  return (
    <Stack gap="10px" alignItems="baseline" paddingTop="8px">
      <Typography variant="body1">
        Leave accrual performed in intervals
      </Typography>

      {accrualType === "periodically" && (
        <Box border="1px solid" borderRadius="5px" borderColor={iron[700]}>
          <PadBox padding={{ padding: "20px" }}>
            <Stack gap="15px">
              <Stack direction="row" gap="10px">
                <Typography paddingTop="9px">Accrual leave</Typography>

                <DurationAutocompleteV2
                  hideLabel
                  name="leave_accrual.accrual_frequency"
                  control={control}
                  sx={{ width: "230px" }}
                  error={!!accrual_frequency}
                  helperText={errorMessages(accrual_frequency?.message)}
                  disabled={disabled}
                  clearIcon
                />

                <Typography paddingTop="9px">on every</Typography>

                {accrualRate === "monthly" ? (
                  <CustomDayAutoComplete
                    sx={{ width: "140px" }}
                    required
                    name="leave_accrual.initial_accrual_start_day"
                    control={control}
                    error={!!initial_accrual_start_day}
                    helperText={errorMessages(
                      initial_accrual_start_day?.message
                    )}
                    disabled={disabled}
                  />
                ) : (
                  <TextField
                    type="number"
                    name="leave_accrual.initial_accrual_start_day"
                    control={control}
                    placeholder="start day"
                    required
                    sx={{ width: "140px" }}
                    error={!!initial_accrual_start_day}
                    helperText={errorMessages(
                      initial_accrual_start_day?.message
                    )}
                    disabled={disabled}
                  />
                )}

                <Typography paddingTop="9px">
                  day of the {accrualRateLabelV2(accrualRate)}
                </Typography>
              </Stack>

              {accrualRate !== "yearly" && accrualRate && (
                <Stack sx={{ cursor: "default" }} gap="10px">
                  <Stack direction="row" gap="10px">
                    <CheckBox
                      name="leave_accrual.is_unevenly_accrued"
                      size="small"
                      control={control}
                      disabled={!accrualRate || disabled}
                    />

                    <Typography>
                      Leave accrual different in each Interval
                    </Typography>
                  </Stack>

                  {isUnevenlyAccrued && (
                    <Box
                      border="1px solid"
                      borderRadius="5px"
                      borderColor={iron[700]}
                    >
                      <PadBox padding={{ padding: "20px" }}>
                        <Stack gap="20px">
                          <Stack
                            flexDirection="row"
                            justifyContent="space-between"
                          >
                            <Typography>
                              Leave Accrual Per
                              {accrualRateLabel(accrualRate)}
                            </Typography>

                            <Stack
                              justifyContent="flex-end"
                              alignItems="flex-end"
                            >
                              <Typography>
                                {unevenAccrualRatesTotal} /{quotaLimit}
                              </Typography>
                              {unevenAccrualRatesTotal != quotaLimit && (
                                <Typography
                                  variant="caption"
                                  color="red"
                                  paddingLeft={2}
                                >
                                  The total must match the annual quota.
                                </Typography>
                              )}
                            </Stack>
                          </Stack>

                          <Divider />

                          <Box
                            display="grid"
                            gridTemplateColumns="repeat(3, 1fr)"
                            gap={4}
                          >
                            {getLeaveAccrualOptions(accrualRate, months).map(
                              (item, index) => {
                                return (
                                  <Stack
                                    key={item}
                                    flexDirection="row"
                                    alignItems="center"
                                    gap="5px"
                                  >
                                    <Typography
                                      width={
                                        accrualRate === "quarterly"
                                          ? "140px"
                                          : "100px"
                                      }
                                    >
                                      {item}
                                    </Typography>

                                    <TextField
                                      type="number"
                                      name={`leave_accrual.uneven_accrual_rates.${index}`}
                                      control={control}
                                      required
                                      error={!!uneven_accrual_rates?.[index]}
                                      helperText={errorMessages(
                                        uneven_accrual_rates?.[index]?.message
                                      )}
                                      disabled={disabled}
                                    />
                                  </Stack>
                                );
                              }
                            )}
                          </Box>
                        </Stack>
                      </PadBox>
                    </Box>
                  )}
                </Stack>
              )}
            </Stack>
          </PadBox>
        </Box>
      )}
    </Stack>
  );
};

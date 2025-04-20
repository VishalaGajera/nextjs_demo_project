import {
  Button,
  DeleteAction,
  PadBox,
  TextField,
} from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { useFormContext } from "react-hook-form";
import { CustomDayAutoComplete } from "../../../../../../../common/Autocomplete/CustomDayAutocomplete";
import type { ConfigureLeaveFormFieldValues } from "../../ConfigureLeaveForm";

type ProrateBasedOnDateSetupProps = {
  disabled?: boolean;
};

export const ProrateBasedOnDateSetup = ({
  disabled = false,
}: ProrateBasedOnDateSetupProps) => {
  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ConfigureLeaveFormFieldValues>();

  const exitingLeaveAccrualProrateQuota = watch(
    "leave_accrual_prorate.exiting_leave_accrual_prorate_quota"
  );

  const exitingProratedCreditRules = watch(
    "leave_accrual_prorate.exiting_prorated_credit_rules"
  );

  const handleAddCreditRules = () => {
    if (exitingProratedCreditRules?.length) {
      exitingProratedCreditRules.push({
        from_date: null,
        to_date: null,
        rate: null,
      });

      setValue(
        "leave_accrual_prorate.exiting_prorated_credit_rules",
        exitingProratedCreditRules
      );
    }
  };

  const handleRemoveCreditRules = (index: number) => {
    if (exitingProratedCreditRules?.length) {
      const updatedArray = exitingProratedCreditRules.filter(
        (_: unknown, i: number) => i !== index
      );

      setValue(
        "leave_accrual_prorate.exiting_prorated_credit_rules",
        updatedArray
      );
    }
  };

  const { exiting_prorated_credit_rules } = errors.leave_accrual_prorate ?? {};

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  return (
    <Stack gap="10px">
      <Typography variant="body1" paddingTop="8px">
        Prorate based on range of dates
      </Typography>

      {exitingLeaveAccrualProrateQuota == "based_on_range_of_date" && (
        <Box
          border="1px solid"
          borderRadius="5px"
          borderColor={iron[700]}
          sx={{ cursor: "default" }}
        >
          <PadBox padding={{ padding: "20px" }}>
            <Stack gap="30px">
              {exitingProratedCreditRules?.map((item, index) => {
                return (
                  <Stack
                    flexDirection="row"
                    gap="10px"
                    // eslint-disable-next-line sonarjs/no-array-index-key
                    key={index}
                  >
                    <Typography sx={{ paddingTop: "8px" }}>
                      If the exit date is between the
                    </Typography>

                    <CustomDayAutoComplete
                      sx={{ width: "160px" }}
                      required
                      name={`leave_accrual_prorate.exiting_prorated_credit_rules.${index}.from_date`}
                      control={control}
                      error={
                        !!exiting_prorated_credit_rules?.[index]?.from_date
                      }
                      helperText={errorMessages(
                        exiting_prorated_credit_rules?.[index]?.from_date
                          ?.message
                      )}
                      disabled={disabled}
                    />

                    <Typography sx={{ paddingTop: "8px" }}>and</Typography>

                    <CustomDayAutoComplete
                      sx={{ width: "160px" }}
                      required
                      name={`leave_accrual_prorate.exiting_prorated_credit_rules.${index}.to_date`}
                      control={control}
                      error={!!exiting_prorated_credit_rules?.[index]?.to_date}
                      helperText={errorMessages(
                        exiting_prorated_credit_rules?.[index]?.to_date?.message
                      )}
                      disabled={disabled}
                    />

                    <Typography sx={{ paddingTop: "8px" }}>
                      of the month, allocate
                    </Typography>

                    <TextField
                      type="number"
                      name={`leave_accrual_prorate.exiting_prorated_credit_rules.${index}.rate`}
                      control={control}
                      sx={{ width: "140px" }}
                      error={!!exiting_prorated_credit_rules?.[index]?.rate}
                      helperText={errorMessages(
                        exiting_prorated_credit_rules?.[index]?.rate?.message
                      )}
                      disabled={disabled}
                    />

                    <Typography sx={{ paddingTop: "8px" }}>days.</Typography>

                    {!!index && (
                      <Box>
                        <DeleteAction
                          disabled={disabled}
                          onClick={() => handleRemoveCreditRules(index)}
                        />
                      </Box>
                    )}
                  </Stack>
                );
              })}

              <Divider>
                <Button
                  startIcon={<Add />}
                  onClick={() => handleAddCreditRules()}
                  disabled={
                    !!errors?.leave_accrual_prorate
                      ?.exiting_prorated_credit_rules || disabled
                  }
                >
                  Add Range
                </Button>
              </Divider>
            </Stack>
          </PadBox>
        </Box>
      )}
    </Stack>
  );
};

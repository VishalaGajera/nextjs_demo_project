import { CheckBox, RadioGroupField, TextField } from "@codezee/sixtify-brahma";
import { Stack, Typography, useTheme } from "@mui/material";
import { isEqual } from "lodash";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { PenaltyRulesFormFieldValues } from "../PenaltyRulesForm";

type AttendanceSchemaHolidayProps = {
  loading?: boolean;
};

export const AttendanceSchemaHoliday = ({
  loading = false,
}: AttendanceSchemaHolidayProps) => {
  const { t } = useTranslation();

  const {
    watch,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<PenaltyRulesFormFieldValues>();

  const searchParams = useSearchParams();

  const mode = searchParams.get("page");

  const isViewMode = mode === "view-penalty-rules";

  const theme = useTheme();

  const { slate, red } = theme.palette.app.color;

  const errorMessages = (messageKey?: string) => messageKey && t(messageKey);

  const is_holiday_penalty_enabled = watch("is_holiday_penalty_enabled");

  const holiday_penalty_condition = watch("holiday_penalty_condition");

  const condition_type = watch("holiday_penalty_condition.condition_type");

  const penalty_deduction_source = watch(
    "holiday_penalty_condition.penalty_deduction_source"
  );

  const defaultHolidayValues = {
    days_with_no_attendance: null,
    condition_type: null,
    leave_deduction_days: null,
    penalty_deduction_source: null,
  };

  useMemo(() => {
    if (!is_holiday_penalty_enabled) {
      if (errors.holiday_penalty_condition) {
        clearErrors("holiday_penalty_condition");
      }

      if (!isEqual(holiday_penalty_condition, defaultHolidayValues)) {
        setValue("holiday_penalty_condition", defaultHolidayValues);
      }
    } else if (is_holiday_penalty_enabled) {
      if (!condition_type) {
        setValue("holiday_penalty_condition.condition_type", "sandwich", {
          shouldDirty: true,
        });
      }

      if (!penalty_deduction_source) {
        setValue(
          "holiday_penalty_condition.penalty_deduction_source",
          "loss_of_pay",
          {
            shouldDirty: true,
          }
        );
      }
    }
  }, [is_holiday_penalty_enabled, holiday_penalty_condition, condition_type]);

  return (
    <Stack gap="10px">
      <Stack direction="row" gap="10px">
        <CheckBox
          name="is_holiday_penalty_enabled"
          control={control}
          size="small"
          disabled={isViewMode}
          loading={loading}
        />

        <Typography variant="body1" fontWeight={500}>
          Do you want the system to apply a penalty for adjacent holidays on no
          attendance days?
        </Typography>
      </Stack>

      {is_holiday_penalty_enabled && (
        <Stack gap="10px" paddingLeft="30px">
          <Stack
            direction="row"
            gap="5px"
            alignItems="baseline"
            color={slate[900]}
          >
            <Typography variant="body1" fontWeight={500}>
              If there are
            </Typography>

            <TextField
              control={control}
              type="number"
              name="holiday_penalty_condition.days_with_no_attendance"
              placeholder="00"
              loading={loading}
              required
              error={
                !!errors.holiday_penalty_condition?.days_with_no_attendance
              }
              helperText={errorMessages(
                errors.holiday_penalty_condition?.days_with_no_attendance
                  ?.message
              )}
              disabled={isViewMode}
              sx={{ width: "100%", maxWidth: "170px" }}
            />

            <Typography variant="body1">
              or more days with no attendance.
            </Typography>
          </Stack>

          <Stack color={slate[900]}>
            <RadioGroupField
              direction="column"
              loading={loading}
              name="holiday_penalty_condition.condition_type"
              size="medium"
              control={control}
              disabled={isViewMode}
              options={[
                {
                  values: "sandwich",
                  label:
                    "If holiday is right between two no attendance days (Holiday is sandwiched between no attendance days)",
                  disabled: isViewMode,
                },
                {
                  values: "before",
                  label: "If no attendance day is right before a holiday",
                  disabled: isViewMode,
                },
                {
                  values: "after",
                  label: "If no attendance day is right after a holiday",
                  disabled: isViewMode,
                },
                {
                  values: "anywhere",
                  label:
                    "If no attendance day is before or after or in-between a holiday",
                  disabled: isViewMode,
                },
              ]}
            />

            <Typography variant="caption" sx={{ color: red[900] }}>
              {errorMessages(
                errors.holiday_penalty_condition?.condition_type?.message
              )}
            </Typography>
          </Stack>

          <Stack direction="column" gap="10px">
            <Typography variant="body1" fontWeight={500}>
              Leave is deducted as Follows :
            </Typography>

            <Stack
              direction="row"
              alignItems="baseline"
              gap="5px"
              color={slate[900]}
            >
              <Typography>Deduct</Typography>

              <TextField
                control={control}
                type="number"
                name="holiday_penalty_condition.leave_deduction_days"
                placeholder="00"
                loading={loading}
                required
                disabled={isViewMode}
                error={!!errors.holiday_penalty_condition?.leave_deduction_days}
                helperText={errorMessages(
                  errors.holiday_penalty_condition?.leave_deduction_days
                    ?.message
                )}
                sx={{ width: "100%", maxWidth: "170px" }}
              />

              <Typography>Days of leave</Typography>
            </Stack>
          </Stack>

          <Stack direction="column" gap="10px">
            <Typography variant="body1" fontWeight={500}>
              Leave Penalties Deducted From :
            </Typography>

            <Stack color={slate[900]}>
              <RadioGroupField
                direction="column"
                loading={loading}
                name="holiday_penalty_condition.penalty_deduction_source"
                size="medium"
                control={control}
                options={[
                  {
                    values: "loss_of_pay",
                    label: "Deduct From Loss Of Pay (LOP)",
                    disabled: isViewMode,
                  },
                  {
                    values: "paid",
                    label: "Deduct From Paid Leave Balance",
                    disabled: true,
                  },
                ]}
              />

              <Typography variant="caption" sx={{ color: red[900] }}>
                {errorMessages(
                  errors.holiday_penalty_condition?.penalty_deduction_source
                    ?.message
                )}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

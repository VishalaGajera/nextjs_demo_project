import { CheckBox, RadioGroupField, TextField } from "@codezee/sixtify-brahma";
import { Stack, Typography, useTheme } from "@mui/material";
import { isEqual } from "lodash";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { PenaltyRulesFormFieldValues } from "../PenaltyRulesForm";

type AttendanceSchemaWeeklyOffProps = {
  loading?: boolean;
};

export const AttendanceSchemaWeeklyOff = ({
  loading = false,
}: AttendanceSchemaWeeklyOffProps) => {
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

  const is_weekly_off_penalty_enabled = watch("is_weekly_off_penalty_enabled");

  const weekly_off_penalty_condition = watch("weekly_off_penalty_condition");

  const condition_type = watch("weekly_off_penalty_condition.condition_type");

  const penalty_deduction_source = watch(
    "weekly_off_penalty_condition.penalty_deduction_source"
  );

  const defaultWeeklyOffsPenaltyValues = {
    days_with_no_attendance: null,
    condition_type: null,
    leave_deduction_days: null,
    penalty_deduction_source: null,
  };

  useMemo(() => {
    if (!is_weekly_off_penalty_enabled) {
      if (errors.weekly_off_penalty_condition) {
        clearErrors("weekly_off_penalty_condition");
      }

      if (
        !isEqual(weekly_off_penalty_condition, defaultWeeklyOffsPenaltyValues)
      ) {
        setValue(
          "weekly_off_penalty_condition",
          defaultWeeklyOffsPenaltyValues
        );
      }
    } else if (is_weekly_off_penalty_enabled) {
      if (!condition_type) {
        setValue("weekly_off_penalty_condition.condition_type", "sandwich", {
          shouldDirty: true,
        });
      }

      if (!penalty_deduction_source) {
        setValue(
          "weekly_off_penalty_condition.penalty_deduction_source",
          "loss_of_pay",
          {
            shouldDirty: true,
          }
        );
      }
    }
  }, [is_weekly_off_penalty_enabled, weekly_off_penalty_condition]);

  return (
    <Stack gap="10px">
      <Stack direction="row" gap="10px">
        <CheckBox
          name="is_weekly_off_penalty_enabled"
          control={control}
          size="small"
          disabled={isViewMode}
          loading={loading}
        />

        <Typography variant="body1" fontWeight={500}>
          Do you want the system to apply a penalty for adjacent weekly off on
          no attendance days?
        </Typography>
      </Stack>

      {is_weekly_off_penalty_enabled && (
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
              name="weekly_off_penalty_condition.days_with_no_attendance"
              placeholder="00"
              loading={loading}
              disabled={isViewMode}
              required
              error={
                !!errors.weekly_off_penalty_condition?.days_with_no_attendance
              }
              helperText={errorMessages(
                errors.weekly_off_penalty_condition?.days_with_no_attendance
                  ?.message
              )}
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
              name="weekly_off_penalty_condition.condition_type"
              size="medium"
              control={control}
              disabled={isViewMode}
              options={[
                {
                  values: "sandwich",
                  label:
                    "If Weekly Off is right between two no attendance days (Weekly Off is sandwiched between no attendance days",
                  disabled: isViewMode,
                },
                {
                  values: "before",
                  label: "If no attendance day is right before a Weekly Off",
                  disabled: isViewMode,
                },
                {
                  values: "after",
                  label: "If no attendance day is right after a Weekly Off",
                  disabled: false,
                },
                {
                  values: "anywhere",
                  label:
                    "If no attendance day is before or after or in-between a Weekly Off",
                  disabled: false,
                },
              ]}
            />

            <Typography variant="body2" sx={{ color: red[900] }}>
              {errorMessages(
                errors.weekly_off_penalty_condition?.condition_type?.message
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
                name="weekly_off_penalty_condition.leave_deduction_days"
                placeholder="00"
                loading={loading}
                disabled={isViewMode}
                required
                error={
                  !!errors.weekly_off_penalty_condition?.leave_deduction_days
                }
                helperText={errorMessages(
                  errors.weekly_off_penalty_condition?.leave_deduction_days
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
                name="weekly_off_penalty_condition.penalty_deduction_source"
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

              <Typography variant="body2" sx={{ color: red[900] }}>
                {errorMessages(
                  errors.weekly_off_penalty_condition?.penalty_deduction_source
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

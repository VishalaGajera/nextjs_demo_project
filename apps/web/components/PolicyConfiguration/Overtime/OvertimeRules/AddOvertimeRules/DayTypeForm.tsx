import { CheckBox, RadioGroupField, TextField } from "@codezee/sixtify-brahma";
import { InputLabel, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { isEmpty } from "lodash";
import { memo, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import type {
  DayTypeFormFields,
  OvertimeRulesFormFieldValues,
} from "./AddOvertimeRulesForm";
import {
  OvertimeCriteriaForm,
  overtimeCriteriaSchema,
} from "./OvertimeCriteriaForm";

type DayTypeFormProps = {
  dayType: "working_day" | "weekly_off_day" | "holiday_day";
  loading?: boolean;
  disabled?: boolean;
  setDeletedOTcriteriaId?: (criteriaId: DayTypeFormFields) => void;
  deletedOTcriteriaId?: DayTypeFormFields;
};

export const dayTypeSchema = z
  .object({
    is_employee_paid_overtime_enabled: z.boolean().optional(),

    calculation_unit_type: z.enum(["hours", "day"]).optional(),
    hours_compensation: z
      .enum(["all_hours", "before_shift_start", "after_shift_end"])
      .optional(),
    paid_overtime_criteria: z
      .array(overtimeCriteriaSchema)
      .min(1, { message: "At least one overtime criteria is required" })
      .optional(),
    is_overtime_min_time_enabled: z.boolean().optional().nullable(),
    minimum_in_time_overtime_duration_minutes: z.number().nullable().optional(),
    minimum_out_time_overtime_duration_minutes: z
      .number()
      .nullable()
      .optional(),
  })
  .superRefine((data, ctx) => {
    data.paid_overtime_criteria?.forEach((row, index) => {
      if (index > 0) {
        const prevRow = data.paid_overtime_criteria?.[index - 1];

        if (
          prevRow?.overtime_end_minutes &&
          row.overtime_start_minutes &&
          Number(prevRow.overtime_end_minutes + 1) !==
            Number(row.overtime_start_minutes)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Start time must be exactly one greater than the end time of the previous row.",
            path: [
              "paid_overtime_criteria",
              `${index}`,
              "overtime_start_minutes",
            ],
          });
        }
      }

      if (!row.overtime_start_minutes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: [
            "paid_overtime_criteria",
            `${index}`,
            "overtime_start_minutes",
          ],
        });
      }

      if (!row.overtime_end_minutes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["paid_overtime_criteria", `${index}`, "overtime_end_minutes"],
        });
      }

      if (
        data.calculation_unit_type === "hours" &&
        !row.overtime_rate_type_id
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["paid_overtime_criteria", `${index}`, "overtime_rate_type_id"],
        });
      }

      if (data.calculation_unit_type === "day" && !row.overtime_rate_type_day) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: [
            "paid_overtime_criteria",
            `${index}`,
            "overtime_rate_type_day",
          ],
        });
      }
    });

    if (
      data.is_overtime_min_time_enabled &&
      data.minimum_in_time_overtime_duration_minutes === null &&
      data.hours_compensation !== "after_shift_end"
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["minimum_in_time_overtime_duration_minutes"],
      });
    }

    if (
      data.is_overtime_min_time_enabled &&
      data.minimum_out_time_overtime_duration_minutes === null &&
      data.hours_compensation !== "before_shift_start"
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["minimum_out_time_overtime_duration_minutes"],
      });
    }
  });

const DayTypeForm = ({
  dayType,
  loading = false,
  disabled = false,
  setDeletedOTcriteriaId,
  deletedOTcriteriaId,
}: DayTypeFormProps) => {
  const {
    control,
    clearErrors,
    watch,
    resetField,
    formState: { errors },
  } = useFormContext<OvertimeRulesFormFieldValues>();

  const calculation_unit_type = watch(`${dayType}.calculation_unit_type`);

  const theme = useTheme();

  const { red } = theme.palette.app.color;

  const hoursCompensation = watch(`${dayType}.hours_compensation`);

  const is_overtime_min_time_enabled = watch(
    `${dayType}.is_overtime_min_time_enabled`
  );

  const isDayTypeEnabled = watch(`${dayType}`);

  const paidEmployeeOTEnabled = watch(
    `${dayType}.is_employee_paid_overtime_enabled`
  );

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  useMemo(() => {
    clearErrors([`${dayType}.paid_overtime_criteria`]);
  }, [calculation_unit_type, paidEmployeeOTEnabled]);

  useEffect(() => {
    if (!is_overtime_min_time_enabled) {
      clearErrors([`${dayType}.minimum_in_time_overtime_duration_minutes`]);

      resetField(`${dayType}.minimum_in_time_overtime_duration_minutes`, {
        defaultValue: null,
      });

      clearErrors([`${dayType}.minimum_out_time_overtime_duration_minutes`]);

      resetField(`${dayType}.minimum_out_time_overtime_duration_minutes`, {
        defaultValue: null,
      });
    }
  }, [is_overtime_min_time_enabled]);

  useEffect(() => {
    if (hoursCompensation === "before_shift_start") {
      clearErrors([`${dayType}.minimum_out_time_overtime_duration_minutes`]);

      resetField(`${dayType}.minimum_out_time_overtime_duration_minutes`, {
        defaultValue: null,
      });
    } else if (hoursCompensation === "after_shift_end") {
      clearErrors([`${dayType}.minimum_in_time_overtime_duration_minutes`]);

      resetField(`${dayType}.minimum_in_time_overtime_duration_minutes`, {
        defaultValue: null,
      });
    } else {
      resetField(`${dayType}.minimum_in_time_overtime_duration_minutes`);
      resetField(`${dayType}.minimum_out_time_overtime_duration_minutes`);
    }
  }, [hoursCompensation]);

  return (
    <Stack gap="10px">
      {isDayTypeEnabled && !paidEmployeeOTEnabled && !isEmpty(errors) && (
        <Typography variant="body1" sx={{ fontWeight: 400, color: red[900] }}>
          Select at least one method for OT
        </Typography>
      )}
      <Stack direction="row" gap="10px">
        <CheckBox
          name={`${dayType}.is_employee_paid_overtime_enabled`}
          control={control}
          disabled={disabled}
          size="small"
          loading={loading}
        />

        <InputLabel>Employee are paid for Overtime (OT) hours.</InputLabel>
      </Stack>
      {paidEmployeeOTEnabled && (
        <>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            How are Overtime (OT) hours calculated and granted?
          </Typography>

          <RadioGroupField
            name={`${dayType}.calculation_unit_type`}
            control={control}
            loading={loading}
            disabled={disabled}
            direction="column"
            label=""
            options={[
              {
                label: "Overtime(OT) is calculated for each OT hour worked.",
                values: "hours",
                disabled: disabled || false,
              },
              {
                label:
                  "Overtime(OT) is calculated as full day / half day based on OT hours worked.",
                values: "day",
                disabled: disabled || false,
              },
            ]}
          />

          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Which additional hours are considered for Overtime(OT) compensation?
          </Typography>

          <RadioGroupField
            name={`${dayType}.hours_compensation`}
            control={control}
            loading={loading}
            disabled={disabled}
            direction="column"
            label=""
            options={[
              {
                label:
                  "All Additional Hours: Any hours worked beyond the shift.",
                values: "all_hours",
                disabled: disabled || false,
              },
              {
                label:
                  "Before Shift Starts: Hours worked before the shift start time.",
                values: "before_shift_start",
                disabled: disabled || false,
              },
              {
                label:
                  "After Shift End: Hours worked after the shift end time.",
                values: "after_shift_end",
                disabled: disabled || false,
              },
            ]}
          />

          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Overtime (OT) payout criteria for employees
          </Typography>

          <OvertimeCriteriaForm
            dayType={dayType}
            disabled={disabled}
            setDeletedOTcriteriaId={setDeletedOTcriteriaId}
            deletedOTcriteriaId={deletedOTcriteriaId}
          />

          <Stack direction="row" gap="10px" alignItems="center">
            <CheckBox
              name={`${dayType}.is_overtime_min_time_enabled`}
              control={control}
              loading={loading}
              disabled={disabled}
              size="small"
            />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Ignore OT compensation if OT hours are less than
            </Typography>

            {hoursCompensation !== "after_shift_end" && (
              <TextField
                name={`${dayType}.minimum_in_time_overtime_duration_minutes`}
                control={control}
                loading={loading}
                placeholder="Before"
                disabled={disabled || !is_overtime_min_time_enabled}
                type="number"
                error={
                  !!errors?.[dayType]?.minimum_in_time_overtime_duration_minutes
                }
                helperText={errorMessages(
                  errors?.[dayType]?.minimum_in_time_overtime_duration_minutes
                    ?.message
                )}
              />
            )}

            {hoursCompensation === "all_hours" && <Typography>/</Typography>}

            {hoursCompensation !== "before_shift_start" && (
              <TextField
                name={`${dayType}.minimum_out_time_overtime_duration_minutes`}
                control={control}
                loading={loading}
                placeholder="After"
                disabled={disabled || !is_overtime_min_time_enabled}
                type="number"
                error={
                  !!errors?.[dayType]
                    ?.minimum_out_time_overtime_duration_minutes
                }
                helperText={errorMessages(
                  errors?.[dayType]?.minimum_out_time_overtime_duration_minutes
                    ?.message
                )}
              />
            )}
            <InputLabel>Minutes</InputLabel>
          </Stack>
        </>
      )}
    </Stack>
  );
};

export const MemoizedDayTypeForm = memo(DayTypeForm);

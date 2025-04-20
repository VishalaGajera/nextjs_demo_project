import {
  CheckBox,
  PadBox,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { ScheduleTypeAutocomplete } from "../../../../../../common/Autocomplete/ScheduleTypeAutocomplete";
import type { ConfigureLeaveFormFieldValues } from "../ConfigureLeaveForm";
import { useGetWeekOffTypeRadioOptions } from "./hooks/useGetWeekOffTypeRadioOptions";

const overLapType = z.enum(["between", "before", "after", "anywhere"]);

const leaveDaysConsiderationType = z.enum(["calender_days", "leave_days"]);

export const LeaveSandwichFormSchema = z
  .object({
    include_weekly_off_in_leave: z.boolean(),
    weekly_off_overlap_type: overLapType,
    weekly_off_leave_days_consideration_type: leaveDaysConsiderationType,
    weekly_off_exceed_threshold_days: z
      .number()
      .int({ message: "Days should not be in point." })
      .nullable()
      .optional(),
    ignore_half_day_leave_for_weekly_off: z.boolean(),
    include_holiday_in_leave: z.boolean(),
    holiday_overlap_type: overLapType,
    holiday_leave_days_consideration_type: leaveDaysConsiderationType,
    holiday_exceed_threshold_days: z
      .number()
      .int({ message: "Days should not be in point." })
      .nullable()
      .optional(),
    ignore_half_day_leave_for_holiday: z.boolean(),
    club_with_other_leave_type_penalization: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (
      data.include_weekly_off_in_leave &&
      data.weekly_off_exceed_threshold_days === null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["weekly_off_exceed_threshold_days"],
        message: "common.required",
      });
    }

    if (
      data.include_weekly_off_in_leave &&
      data.weekly_off_exceed_threshold_days &&
      data.weekly_off_exceed_threshold_days > 365
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["weekly_off_exceed_threshold_days"],
        message: "Days should not be more then 365",
      });
    }

    if (
      data.include_holiday_in_leave &&
      data.holiday_exceed_threshold_days === null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["holiday_exceed_threshold_days"],
        message: "common.required",
      });
    }

    if (
      data.include_holiday_in_leave &&
      data.holiday_exceed_threshold_days &&
      data.holiday_exceed_threshold_days > 365
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["holiday_exceed_threshold_days"],
        message: "Days should not be more then 365",
      });
    }
  });

export type LeaveSandwichFormFieldValues = z.infer<
  typeof LeaveSandwichFormSchema
>;

export const LeaveSandwichFormDefaultValues: LeaveSandwichFormFieldValues = {
  include_weekly_off_in_leave: false,
  weekly_off_overlap_type: "between",
  weekly_off_leave_days_consideration_type: "calender_days",
  weekly_off_exceed_threshold_days: null,
  ignore_half_day_leave_for_weekly_off: false,
  include_holiday_in_leave: false,
  holiday_overlap_type: "between",
  holiday_leave_days_consideration_type: "calender_days",
  holiday_exceed_threshold_days: null,
  ignore_half_day_leave_for_holiday: false,
  club_with_other_leave_type_penalization: false,
};

export type LeaveSandwichFormProps = {
  disabled?: boolean;
};

export const LeaveSandwichForm = ({
  disabled = false,
}: LeaveSandwichFormProps) => {
  const {
    control,
    watch,
    formState: { errors },
    resetField,
  } = useFormContext<ConfigureLeaveFormFieldValues>();

  const includeWeeklyOffInLeave = watch(
    "leave_sandwich.include_weekly_off_in_leave"
  );

  const isSystemGenerated = watch("is_system_generated");

  const includeHolidayInLeave = watch(
    "leave_sandwich.include_holiday_in_leave"
  );

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const { weekly_off_exceed_threshold_days, holiday_exceed_threshold_days } =
    errors.leave_sandwich ?? {};

  const { weekOffTypeRadioOptions, holidayOverlapTypeRadioOptions } =
    useGetWeekOffTypeRadioOptions({ disabled });

  useEffect(() => {
    if (!includeWeeklyOffInLeave) {
      resetField("leave_sandwich.weekly_off_exceed_threshold_days");
    }

    if (!includeHolidayInLeave) {
      resetField("leave_sandwich.holiday_exceed_threshold_days");
    }
  }, [includeWeeklyOffInLeave, includeHolidayInLeave]);

  return (
    <Stack gap="15px">
      <Box>
        <Stack direction="row" gap="10px">
          <CheckBox
            name="leave_sandwich.include_weekly_off_in_leave"
            control={control}
            size="small"
            disabled={disabled}
          />

          <Typography>
            If leave is adjacent to a weekly off, the weekly off is included in
            the leave.
          </Typography>
        </Stack>

        {includeWeeklyOffInLeave && (
          <PadBox padding={{ padding: "15px" }}>
            <Stack gap="10px">
              <Stack gap="10px" direction="row">
                <Typography paddingTop="7px">If total leave exceed</Typography>

                <TextField
                  sx={{ maxWidth: "150px" }}
                  type="number"
                  name="leave_sandwich.weekly_off_exceed_threshold_days"
                  control={control}
                  label=""
                  error={!!weekly_off_exceed_threshold_days}
                  helperText={errorMessages(
                    weekly_off_exceed_threshold_days?.message
                  )}
                  disabled={disabled}
                />

                <ScheduleTypeAutocomplete
                  sx={{ width: "220px" }}
                  name="leave_sandwich.weekly_off_leave_days_consideration_type"
                  control={control}
                  clearIcon
                  disabled={disabled}
                />
              </Stack>

              <RadioGroupField
                name="leave_sandwich.weekly_off_overlap_type"
                control={control}
                direction="column"
                label=""
                options={weekOffTypeRadioOptions}
              />
            </Stack>
          </PadBox>
        )}
      </Box>

      <Box>
        <Stack direction="row" gap="10px">
          <CheckBox
            name="leave_sandwich.include_holiday_in_leave"
            control={control}
            size="small"
            disabled={disabled}
          />

          <Typography>
            If leave is adjacent to a Holiday, the Holiday is included in the
            leave.
          </Typography>
        </Stack>

        {includeHolidayInLeave && (
          <PadBox padding={{ padding: "15px" }}>
            <Stack gap="10px">
              <Stack gap="10px" direction="row">
                <Typography paddingTop="7px">If total leave exceed</Typography>

                <TextField
                  sx={{ maxWidth: "150px" }}
                  type="number"
                  name="leave_sandwich.holiday_exceed_threshold_days"
                  control={control}
                  label=""
                  error={!!holiday_exceed_threshold_days}
                  helperText={errorMessages(
                    holiday_exceed_threshold_days?.message
                  )}
                  disabled={disabled}
                />

                <ScheduleTypeAutocomplete
                  sx={{ width: "220px" }}
                  name="leave_sandwich.holiday_leave_days_consideration_type"
                  control={control}
                  clearIcon
                  disabled={disabled}
                />
              </Stack>

              <RadioGroupField
                name="leave_sandwich.holiday_overlap_type"
                control={control}
                direction="column"
                label=""
                options={holidayOverlapTypeRadioOptions}
              />
            </Stack>
          </PadBox>
        )}
      </Box>

      {!isSystemGenerated && (
        <Stack direction="row" gap="10px">
          <CheckBox
            name="leave_sandwich.club_with_other_leave_type_penalization"
            control={control}
            size="small"
            disabled={disabled}
          />

          <Typography>Club sandwich policy across leave types.</Typography>
        </Stack>
      )}
    </Stack>
  );
};

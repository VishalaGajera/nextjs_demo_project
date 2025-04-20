import { CheckBox, PadBox, TextField } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { LeaveBalanceAdjustmentAutocomplete } from "../../../../../../common/Autocomplete/LeaveBalanceAdjustmentAutocomplete";
import type { ConfigureLeaveFormFieldValues } from "../ConfigureLeaveForm";
import {
  CarryForwardPolicyForm,
  yearAroundEncashmentRangesSchema,
} from "./CarryForwardPolicyForm";

export const LeaveYearEndFormSchema = z
  .object({
    year_end_processing_type: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    does_carryover_leave_expire: z.boolean(),
    carryover_leaves_expire_in_days: z
      .number()
      .int({ message: "Days should not be in point." })
      .nullable(),
    year_around_encashment_ranges: z
      .array(yearAroundEncashmentRangesSchema)
      .nullable(),
  })
  .superRefine((data, ctx) => {
    if (
      data.year_end_processing_type == "carry_forward_than_encash" ||
      (data.year_end_processing_type == "encash_than_carry_forward" &&
        data?.year_around_encashment_ranges?.length)
    ) {
      data.year_around_encashment_ranges?.forEach((item, index) => {
        if (!item?.balance_exceeds) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [`year_around_encashment_ranges.${index}.balance_exceeds`],
            message: "common.required",
          });
        }

        if (!item?.payable_or_carry_forward_days) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [
              `year_around_encashment_ranges.${index}.payable_or_carry_forward_days`,
            ],
            message: "common.required",
          });
        }

        if (!item?.max_payable_or_carry_forward_days) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [
              `year_around_encashment_ranges.${index}.max_payable_or_carry_forward_days`,
            ],
            message: "common.required",
          });
        }
      });
    }

    if (
      data?.does_carryover_leave_expire &&
      data.carryover_leaves_expire_in_days === null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["carryover_leaves_expire_in_days"],
        message: "common.required",
      });
    }

    if (
      data?.does_carryover_leave_expire &&
      data.carryover_leaves_expire_in_days &&
      data.carryover_leaves_expire_in_days > 365
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["carryover_leaves_expire_in_days"],
        message: "Days should not be more then 365",
      });
    }
  });

export type LeaveYearEndFormFieldValues = z.infer<
  typeof LeaveYearEndFormSchema
>;

export const LeaveYearEndFormDefaultValues: LeaveYearEndFormFieldValues = {
  year_end_processing_type: "reset",
  does_carryover_leave_expire: false,
  carryover_leaves_expire_in_days: null,
  year_around_encashment_ranges: null,
};

type LeaveYearEndFormProps = {
  disabled?: boolean;
};

export const LeaveYearEndForm = ({
  disabled = false,
}: LeaveYearEndFormProps) => {
  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  const {
    control,
    watch,
    formState: { errors },
    setValue,
    resetField,
    clearErrors,
  } = useFormContext<ConfigureLeaveFormFieldValues>();

  const yearEndProcessingType = watch(
    "year_end_processing.year_end_processing_type"
  );

  const doesCarryoverLeaveExpire = watch(
    "year_end_processing.does_carryover_leave_expire"
  );

  const yearAroundEncashmentRanges = watch(
    "year_end_processing.year_around_encashment_ranges"
  );

  const isSystemGenerated = watch("is_system_generated");

  const carryForwardThanEncash =
    yearEndProcessingType == "carry_forward_than_encash";

  const encashThanCarryForward =
    yearEndProcessingType == "encash_than_carry_forward";

  const quotaType = watch("leave_quota.quota_type");

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const { year_end_processing_type, carryover_leaves_expire_in_days } =
    errors?.year_end_processing ?? {};

  useEffect(() => {
    const newLog = {
      balance_exceeds: null,
      payable_or_carry_forward_days: null,
      max_payable_or_carry_forward_days: null,
    };

    const checkHasValues = yearAroundEncashmentRanges?.some(
      (item) => "id" in item
    );

    if ((carryForwardThanEncash || encashThanCarryForward) && !checkHasValues) {
      setValue("year_end_processing.year_around_encashment_ranges", [newLog]);
    } else {
      resetField("year_end_processing.year_around_encashment_ranges");
    }
  }, [yearEndProcessingType]);

  useEffect(() => {
    if (!doesCarryoverLeaveExpire) {
      clearErrors("year_end_processing.carryover_leaves_expire_in_days");
    }
  }, [doesCarryoverLeaveExpire]);

  return (
    <Stack gap="15px">
      <Typography paddingTop="7px">
        What happens to any unused leave balances at the end of the year?
      </Typography>

      <LeaveBalanceAdjustmentAutocomplete
        name="year_end_processing.year_end_processing_type"
        control={control}
        error={!!year_end_processing_type}
        helperText={errorMessages(year_end_processing_type?.message)}
        sx={{ width: "370px" }}
        disabled={quotaType == "unlimited" || disabled}
        clearIcon
      />

      {(encashThanCarryForward || carryForwardThanEncash) && (
        <Typography paddingTop="7px">
          Remaining leave days are carried forward or paid to employees.
        </Typography>
      )}

      {carryForwardThanEncash && (
        <Box
          border="1px solid"
          borderRadius="5px"
          borderColor={iron[700]}
          sx={{ cursor: "default" }}
        >
          <PadBox padding={{ padding: "20px" }}>
            <CarryForwardPolicyForm
              leaveCategory="year_end_processing"
              leaveSubCategory="year_around_encashment_ranges"
              buttonLabel="Add Range"
              disabled={disabled}
            />
          </PadBox>
        </Box>
      )}

      {encashThanCarryForward && (
        <Box
          border="1px solid"
          borderRadius="5px"
          borderColor={iron[700]}
          sx={{ cursor: "default" }}
        >
          <PadBox padding={{ padding: "20px" }}>
            <CarryForwardPolicyForm
              leaveCategory="year_end_processing"
              leaveSubCategory="year_around_encashment_ranges"
              buttonLabel="Add Range"
              disabled={disabled}
            />
          </PadBox>
        </Box>
      )}

      {!isSystemGenerated && (
        <Stack direction="row" gap="10px" alignItems="baseline">
          <CheckBox
            name="year_end_processing.does_carryover_leave_expire"
            size="small"
            control={control}
            sx={{ top: "3px" }}
            disabled={quotaType == "unlimited" || disabled}
          />

          <Stack flexDirection="row" gap="10px" alignItems="baseline">
            <Typography>Carry forward leave expires in</Typography>

            <TextField
              type="number"
              name="year_end_processing.carryover_leaves_expire_in_days"
              control={control}
              placeholder="days"
              sx={{ width: "140px" }}
              required
              disabled={!doesCarryoverLeaveExpire || disabled}
              error={!!carryover_leaves_expire_in_days}
              helperText={errorMessages(
                carryover_leaves_expire_in_days?.message
              )}
            />

            <Typography> days.</Typography>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

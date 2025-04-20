import {
  CheckBox,
  FormContainer,
  PadBox,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { sum } from "lodash";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { CustomDayAutoComplete } from "../../../../../../common/Autocomplete/CustomDayAutocomplete";
import { LeaveTypeCategoryAutocomplete } from "../../../../../../common/Autocomplete/LeaveTypeCategoryAutocomplete";
import { getRemainingMonths } from "../../hooks/helper";
import type { ConfigureLeaveFormFieldValues } from "../ConfigureLeaveForm";
import { useGetLeaveAccrualTypeRadioOptions } from "./hooks/useGetLeaveAccrualTypeRadioOptions";

const yearlyLeaveSchema = z.enum(["limited", "unlimited"]);

const accrualTypeSchema = z.enum(["periodically", "immediately"]);

const accrualRateTypeSchema = z.enum([
  "monthly",
  "quarterly",
  "half_yearly",
  "yearly",
]);

const measureUnitSchema = z.enum(["day", "hour"]);

export const leaveQuotaSchema = z
  .object({
    measure_unit: measureUnitSchema,
    quota_type: yearlyLeaveSchema,
    quota_limit: z
      .number()
      .int({ message: "Days should not be in point." })
      .min(1, { message: "day must be greater then 0" })
      .nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.quota_type === "limited" && !data.quota_limit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["quota_limit"],
        message: "common.required",
      });
    }

    if (
      data.quota_type === "limited" &&
      data.quota_limit &&
      data.quota_limit > 365
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["quota_limit"],
        message: "Days should not be more then 365",
      });
    }
  });

export const LeaveAccrualSchema = z
  .object({
    accrual_type: accrualTypeSchema,
    accrual_frequency: accrualRateTypeSchema.nullable(),
    initial_accrual_start_day: z
      .number()
      .int({ message: "Days should not be in point." })
      .nullable(),
    is_unevenly_accrued: z.boolean(),
    uneven_accrual_rates: z
      .array(
        z.number().int({ message: "Days should not be in point." }).nullable()
      )
      .nullable(),
    is_credited_leave_expires: z.boolean(),
    credited_leave_expires_in_days: z.number().nullable(),
    is_accrual_stopped_in_long_leave: z.boolean(),
    total_long_leaves_limit_in_days: z
      .number()
      .int({ message: "Days should not be in point." })
      .nullable(),
    long_leave_type_ids: z.array(z.string()).nullable(),
    is_pro_rated: z.boolean(),
    joined_on_or_before_day: z.number().nullable(),
    is_accrual_balance_capped: z.boolean(),
    max_accrual_balance_days: z.number().nullable(),
  })
  // eslint-disable-next-line sonarjs/cognitive-complexity
  .superRefine((data, ctx) => {
    if (
      data.accrual_type === "periodically" &&
      data.initial_accrual_start_day == null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["initial_accrual_start_day"],
        message: "common.required",
      });
    }

    if (
      data.accrual_type === "periodically" &&
      data.initial_accrual_start_day &&
      data.initial_accrual_start_day > 365
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["quota_limit"],
        message: "Days should not be more then 365",
      });
    }

    if (!data.accrual_frequency) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["accrual_frequency"],
        message: "common.required",
      });
    }

    if (
      data.accrual_frequency == "half_yearly" &&
      data?.initial_accrual_start_day &&
      data.initial_accrual_start_day > 180
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["initial_accrual_start_day"],
        message: "valid days upto 180 days",
      });
    }

    if (
      data.accrual_frequency == "quarterly" &&
      data?.initial_accrual_start_day &&
      data.initial_accrual_start_day > 90
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["initial_accrual_start_day"],
        message: "valid days upto 90 days",
      });
    }

    if (
      data.accrual_frequency == "yearly" &&
      data?.initial_accrual_start_day &&
      data.initial_accrual_start_day > 364
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["initial_accrual_start_day"],
        message: "valid days upto 364 days",
      });
    }

    if (
      data.is_credited_leave_expires &&
      data.accrual_type == "periodically" &&
      !data.credited_leave_expires_in_days
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["credited_leave_expires_in_days"],
        message: "common.required",
      });
    }

    if (
      data.is_accrual_stopped_in_long_leave &&
      data.accrual_type == "periodically" &&
      data.total_long_leaves_limit_in_days == null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["total_long_leaves_limit_in_days"],
        message: "common.required",
      });
    }

    if (
      data.is_accrual_stopped_in_long_leave &&
      data.accrual_type == "periodically" &&
      data.total_long_leaves_limit_in_days &&
      data.total_long_leaves_limit_in_days > 365
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["total_long_leaves_limit_in_days"],
        message: "Days should not be more then 365",
      });
    }

    if (data.is_pro_rated && !data.joined_on_or_before_day) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["joined_on_or_before_day"],
        message: "common.required",
      });
    }

    if (data.is_accrual_balance_capped && !data.max_accrual_balance_days) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_accrual_balance_days"],
        message: "common.required",
      });
    }

    if (data.uneven_accrual_rates) {
      data.uneven_accrual_rates.forEach((item, index) => {
        if (item === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["uneven_accrual_rates", index],
            message: "common.required",
          });
        }
      });
    }

    if (
      data.is_accrual_stopped_in_long_leave &&
      !data.long_leave_type_ids?.length
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["long_leave_type_ids"],
        message: "common.required",
      });
    }
  });

export type LeaveAccrualFormFieldValues = z.infer<typeof LeaveAccrualSchema>;

export type LeaveQuotaFormFieldValues = z.infer<typeof leaveQuotaSchema>;

type LeaveAccrualFormProps = {
  defaultValues?: Partial<LeaveAccrualFormFieldValues>;
  loading?: boolean;
  selectedLeavePlanMonth: string;
  leavePlanId: string;
  leaveTypeId: string;
  disabled: boolean;
};

export const leaveAccrualFormDefaultValues: LeaveAccrualFormFieldValues = {
  accrual_type: "immediately",
  accrual_frequency: "monthly",
  initial_accrual_start_day: 1,
  is_unevenly_accrued: false,
  uneven_accrual_rates: null,
  is_credited_leave_expires: false,
  credited_leave_expires_in_days: null,
  is_accrual_stopped_in_long_leave: false,
  total_long_leaves_limit_in_days: null,
  is_pro_rated: false,
  joined_on_or_before_day: null,
  is_accrual_balance_capped: false,
  max_accrual_balance_days: null,
  long_leave_type_ids: null,
};

export const LeaveAccrualForm = ({
  selectedLeavePlanMonth,
  leavePlanId,
  leaveTypeId,
  disabled = false,
}: LeaveAccrualFormProps) => {
  const theme = useTheme();

  const { mirage, sapphireBlue, black } = theme.palette.app.color;

  const {
    control,
    clearErrors,
    watch,
    setError,
    setValue,
    resetField,
    formState: { errors },
  } = useFormContext<ConfigureLeaveFormFieldValues>();

  const quotaType = watch("leave_quota.quota_type");

  const accrualType = watch("leave_accrual.accrual_type");

  const accrualRate = watch("leave_accrual.accrual_frequency") ?? "";

  const quotaLimit = watch("leave_quota.quota_limit");

  const isUnevenlyAccrued = watch("leave_accrual.is_unevenly_accrued");

  const isCreditedLeaveExpires = watch(
    "leave_accrual.is_credited_leave_expires"
  );

  const isAccrualStoppedLongLeave = watch(
    "leave_accrual.is_accrual_stopped_in_long_leave"
  );

  const unevenAccrualRates = watch("leave_accrual.uneven_accrual_rates") ?? [];

  const unevenAccrualRatesTotal = sum(
    unevenAccrualRates.map((rate) => rate ?? 0)
  );

  const isProRated = watch("leave_accrual.is_pro_rated");

  const isSystemGenerated = watch("is_system_generated");

  const isAccrualBalanceCapped = watch(
    "leave_accrual.is_accrual_balance_capped"
  );

  const modifyLeavePlanMonth = selectedLeavePlanMonth.split(" - ")[0] ?? "";

  const months = getRemainingMonths(modifyLeavePlanMonth);

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  useEffect(() => {
    if (quotaType === "limited" && !quotaLimit) {
      setError("leave_quota.quota_limit", {
        type: "custom",
        message: "common.required",
      });
    } else {
      clearErrors("leave_quota.quota_limit");
    }

    if (!isCreditedLeaveExpires || accrualType == "immediately") {
      clearErrors("leave_accrual.credited_leave_expires_in_days");
    }

    if (!isAccrualStoppedLongLeave || accrualType == "immediately") {
      clearErrors("leave_accrual.total_long_leaves_limit_in_days");
      setValue("leave_accrual.is_accrual_stopped_in_long_leave", false);
    }

    if (!isAccrualBalanceCapped) {
      clearErrors("leave_accrual.max_accrual_balance_days");
    }

    if (!isProRated) {
      clearErrors("leave_accrual.joined_on_or_before_day");
    }
  }, [
    quotaType,
    isCreditedLeaveExpires,
    isAccrualStoppedLongLeave,
    isProRated,
    isAccrualBalanceCapped,
    accrualType,
  ]);

  useEffect(() => {
    if (accrualRate && !isUnevenlyAccrued) {
      return resetField("leave_accrual.uneven_accrual_rates");
    }

    if (accrualRate === "yearly") {
      setValue("leave_accrual.is_unevenly_accrued", false);
    }
  }, [accrualRate, isUnevenlyAccrued]);

  useEffect(() => {
    if (accrualType == "immediately") {
      setValue("leave_accrual.is_unevenly_accrued", false);
      setValue("leave_accrual.is_credited_leave_expires", false);
    }
  }, [accrualType]);

  const { quota_limit } = errors.leave_quota ?? {};

  const {
    total_long_leaves_limit_in_days,
    long_leave_type_ids,
    joined_on_or_before_day,
  } = errors.leave_accrual ?? {};

  const { leaveAccrualTypeRadioOptions } = useGetLeaveAccrualTypeRadioOptions({
    months,
    unevenAccrualRatesTotal,
    disabled,
  });

  return (
    <FormContainer>
      <Stack gap={2}>
        <RadioGroupField
          name="leave_quota.measure_unit"
          label="What is the leave Measure unit?"
          control={control}
          sx={{
            alignItems: "center",
          }}
          options={[
            {
              label: "Days",
              values: "day",
              disabled,
            },
          ]}
        />

        <RadioGroupField
          name="leave_quota.quota_type"
          label="What is the yearly leave limit?"
          control={control}
          sx={{
            alignItems: "start",
          }}
          options={[
            {
              label: (
                <Stack gap="10px" alignItems="baseline" direction="row">
                  <Typography variant="body1">Yearly Leave</Typography>

                  <TextField
                    type="number"
                    sx={{ width: "150px" }}
                    name="leave_quota.quota_limit"
                    control={control}
                    label=""
                    required
                    disabled={quotaType != "limited" || disabled}
                    error={!!quota_limit}
                    helperText={errorMessages(quota_limit?.message)}
                  />
                  <Typography variant="body1">Days leave.</Typography>
                </Stack>
              ),
              values: "limited",
              disabled: disabled || (isSystemGenerated ?? false),
            },
            {
              values: "unlimited",
              label: (
                <Box>
                  <Typography variant="body1" paddingTop="8px">
                    No Limit
                  </Typography>
                </Box>
              ),
              disabled: disabled || (isSystemGenerated ?? false),
            },
          ]}
        />

        {quotaType === "limited" && (
          <Stack gap="10px">
            <RadioGroupField
              name="leave_accrual.accrual_type"
              direction="column"
              label="How leave accrual is performed?"
              control={control}
              sx={{
                alignItems: "flex-start",
              }}
              options={leaveAccrualTypeRadioOptions}
            />

            <Stack gap="10px">
              <Typography fontWeight="500" color={mirage[500]}>
                What are the accrual restrictions?
              </Typography>

              <Stack direction="row" gap="10px" alignItems="baseline">
                <CheckBox
                  name="leave_accrual.is_accrual_stopped_in_long_leave"
                  size="small"
                  control={control}
                  disabled={accrualType === "immediately" || disabled}
                  sx={{ top: "3px" }}
                />

                <Stack flexDirection="row" gap="10px" alignItems="baseline">
                  <Typography>
                    Do not accrual leave if the employee is on leave for more
                    than
                  </Typography>

                  <TextField
                    type="number"
                    name="leave_accrual.total_long_leaves_limit_in_days"
                    control={control}
                    placeholder="days"
                    sx={{ width: "140px" }}
                    disabled={
                      !isAccrualStoppedLongLeave ||
                      accrualType == "immediately" ||
                      disabled
                    }
                    required
                    error={!!total_long_leaves_limit_in_days}
                    helperText={errorMessages(
                      total_long_leaves_limit_in_days?.message
                    )}
                  />

                  <Typography>in the previous accrual period</Typography>
                </Stack>
              </Stack>

              {isAccrualStoppedLongLeave && (
                <PadBox padding={{ paddingLeft: "30px" }}>
                  <Stack direction="row" gap="10px">
                    <Typography>Select Leave Type</Typography>

                    <LeaveTypeCategoryAutocomplete
                      name="leave_accrual.long_leave_type_ids"
                      control={control}
                      sx={{
                        minWidth: "250px",
                        "& .MuiAutocomplete-tag": {
                          backgroundColor: sapphireBlue[300],
                          color: black[900],
                        },
                      }}
                      leavePlanId={leavePlanId}
                      leaveTypeId={leaveTypeId}
                      multiple
                      disabled={accrualType == "immediately" || disabled}
                      error={!!long_leave_type_ids}
                      helperText={errorMessages(long_leave_type_ids?.message)}
                    />
                  </Stack>
                </PadBox>
              )}

              <Stack direction="row" gap="10px" alignItems="baseline">
                <CheckBox
                  name="leave_accrual.is_pro_rated"
                  size="small"
                  control={control}
                  sx={{ top: "3px" }}
                  disabled={disabled}
                />

                <Stack flexDirection="row" gap="10px" alignItems="baseline">
                  <Typography>
                    Do not accural leave if the joining date of the employee is
                    after the
                  </Typography>

                  <CustomDayAutoComplete
                    sx={{ width: "140px" }}
                    disabled={!isProRated || disabled}
                    required
                    name="leave_accrual.joined_on_or_before_day"
                    control={control}
                    error={!!joined_on_or_before_day}
                    helperText={errorMessages(joined_on_or_before_day?.message)}
                  />

                  <Typography> th of the month.</Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        )}
      </Stack>
    </FormContainer>
  );
};

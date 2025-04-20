import { CheckBox, TextField } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { CustomDayAutoComplete } from "../../../../../../../common/Autocomplete/CustomDayAutocomplete";
import type { ConfigureLeaveFormFieldValues } from "../../ConfigureLeaveForm";

export const LeaveUsageSchema = z
  .object({
    has_consecutive_days_limit: z.boolean(),
    max_consecutive_days_allowed: z
      .number()
      .int({ message: "Days should not be in point." })
      .nullable(),
    has_monthly_consumption_limit: z.boolean(),
    max_leave_consumption_per_month_days: z
      .number()
      .int({ message: "Days should not be in point." })
      .nullable(),
    restrict_month_end_leave: z.boolean(),
    month_end_restrict_from_day: z
      .number()
      .int({ message: "Days should not be in point." })
      .nullable(),
    require_gap_between_leave_requests: z.boolean(),
    min_gap_days: z
      .number()
      .int({ message: "Days should not be in point." })
      .nullable(),
    has_monthly_frequency_limit: z.boolean(),
    max_instances_per_month: z
      .number()
      .int({ message: "Days should not be in point." })
      .nullable(),
    has_yearly_frequency_limit: z.boolean(),
    max_instances_per_year: z
      .number()
      .int({ message: "Days should not be in point." })
      .nullable(),
  })
  // eslint-disable-next-line sonarjs/cognitive-complexity
  .superRefine((data, ctx) => {
    if (
      data.has_consecutive_days_limit &&
      data.max_consecutive_days_allowed === null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_consecutive_days_allowed"],
        message: "common.required",
      });
    }

    if (
      data.has_consecutive_days_limit &&
      data.max_consecutive_days_allowed === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_consecutive_days_allowed"],
        message: "Days should be more then 0",
      });
    }

    if (
      data.has_consecutive_days_limit &&
      data.max_consecutive_days_allowed &&
      data.max_consecutive_days_allowed > 365
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_consecutive_days_allowed"],
        message: "Days should not be more then 365",
      });
    }

    if (
      data.has_monthly_consumption_limit &&
      data.max_leave_consumption_per_month_days === null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_leave_consumption_per_month_days"],
        message: "common.required",
      });
    }

    if (
      data.has_monthly_consumption_limit &&
      data.max_leave_consumption_per_month_days === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_leave_consumption_per_month_days"],
        message: "Days should be more then 0",
      });
    }

    if (
      data.has_monthly_consumption_limit &&
      data.max_leave_consumption_per_month_days === null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_leave_consumption_per_month_days"],
        message: "Days should not be more then 365",
      });
    }

    if (
      data.has_monthly_consumption_limit &&
      data.max_leave_consumption_per_month_days &&
      data.max_leave_consumption_per_month_days > 365
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_leave_consumption_per_month_days"],
        message: "Days should not be more then 365",
      });
    }

    if (
      data.restrict_month_end_leave &&
      data.month_end_restrict_from_day === null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["month_end_restrict_from_day"],
        message: "common.required",
      });
    }

    if (
      data.restrict_month_end_leave &&
      data.month_end_restrict_from_day === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["month_end_restrict_from_day"],
        message: "Days should be more then 0",
      });
    }

    if (
      data.restrict_month_end_leave &&
      data.month_end_restrict_from_day &&
      data.month_end_restrict_from_day > 365
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["month_end_restrict_from_day"],
        message: "Days should not be more then 365",
      });
    }

    if (data.require_gap_between_leave_requests && data.min_gap_days === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["min_gap_days"],
        message: "common.required",
      });
    }

    if (data.require_gap_between_leave_requests && data.min_gap_days === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["min_gap_days"],
        message: "Days should be more then 0",
      });
    }

    if (
      data.require_gap_between_leave_requests &&
      data.min_gap_days &&
      data.min_gap_days > 365
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["min_gap_days"],
        message: "Days should not be more then 365",
      });
    }

    if (
      data.has_monthly_frequency_limit &&
      data.max_instances_per_month === null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_instances_per_month"],
        message: "common.required",
      });
    }

    if (
      data.has_monthly_frequency_limit &&
      data.max_instances_per_month === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_instances_per_month"],
        message: "Days should be more then 0",
      });
    }

    if (
      data.has_monthly_frequency_limit &&
      data.max_instances_per_month &&
      data.max_instances_per_month > 28
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_instances_per_month"],
        message: "Days should not be more then 28",
      });
    }

    if (
      data.has_yearly_frequency_limit &&
      data.max_instances_per_year === null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_instances_per_year"],
        message: "common.required",
      });
    }

    if (data.has_yearly_frequency_limit && data.max_instances_per_year === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_instances_per_year"],
        message: "Days should be more then 0",
      });
    }

    if (
      data.has_yearly_frequency_limit &&
      data.max_instances_per_year &&
      data.max_instances_per_year > 365
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_instances_per_year"],
        message: "Days should not be more then 365",
      });
    }
  });

export type LeaveUsageFormFieldValues = z.infer<typeof LeaveUsageSchema>;

export const leaveUsageFormDefaultValues: LeaveUsageFormFieldValues = {
  has_consecutive_days_limit: false,
  max_consecutive_days_allowed: null,
  has_monthly_consumption_limit: false,
  max_leave_consumption_per_month_days: null,
  restrict_month_end_leave: false,
  month_end_restrict_from_day: null,
  require_gap_between_leave_requests: false,
  min_gap_days: null,
  has_monthly_frequency_limit: false,
  max_instances_per_month: null,
  has_yearly_frequency_limit: false,
  max_instances_per_year: null,
};

type LeaveUsageFormProps = {
  disabled?: boolean;
};

export const LeaveUsageForm = ({ disabled = false }: LeaveUsageFormProps) => {
  const {
    control,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext<ConfigureLeaveFormFieldValues>();

  const requireDocumentProof = watch(
    "leave_application_and_usage.is_document_required"
  );

  const isPriorNoticeRequired = watch(
    "leave_application_and_usage.is_prior_notice_required"
  );

  const priorNoticeRanges =
    watch("leave_application_and_usage.prior_notice_ranges") ?? [];

  const isAllowApplyingPreviousLeaves = watch(
    "leave_application_and_usage.is_allow_applying_previous_leaves"
  );

  const isRequireMaxPriorNotice = watch(
    "leave_application_and_usage.is_require_max_prior_notice"
  );

  const hasRestrictedLeaveTypePairs = watch(
    "leave_quota.has_restricted_leave_type_pairs"
  );

  const hasConsecutiveDaysLimit = watch(
    "leave_restrictions.has_consecutive_days_limit"
  );

  const hasMonthlyConsumptionLimit = watch(
    "leave_restrictions.has_monthly_consumption_limit"
  );

  const restrictMonthEndLeave = watch(
    "leave_restrictions.restrict_month_end_leave"
  );

  const requireGapBetweenLeaveRequests = watch(
    "leave_restrictions.require_gap_between_leave_requests"
  );

  const hasMonthlyFrequencyLimit = watch(
    "leave_restrictions.has_monthly_frequency_limit"
  );

  const hasYearlyFrequencyLimit = watch(
    "leave_restrictions.has_yearly_frequency_limit"
  );

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  useMemo(() => {
    if (!requireDocumentProof) {
      clearErrors("leave_application_and_usage.document_required_after_days");
    }

    if (!isPriorNoticeRequired && priorNoticeRanges.length) {
      clearErrors("leave_application_and_usage.prior_notice_ranges");
    }

    if (!isAllowApplyingPreviousLeaves) {
      clearErrors(
        "leave_application_and_usage.max_allowed_days_for_previous_leave"
      );
    }

    if (!isRequireMaxPriorNotice) {
      clearErrors("leave_application_and_usage.max_prior_notice_days");
    }

    if (!hasRestrictedLeaveTypePairs) {
      clearErrors("leave_quota.restricted_leave_type_ids");
    }

    if (!hasConsecutiveDaysLimit) {
      clearErrors("leave_restrictions.max_consecutive_days_allowed");
    }

    if (!hasMonthlyConsumptionLimit) {
      clearErrors("leave_restrictions.max_leave_consumption_per_month_days");
    }

    if (!restrictMonthEndLeave) {
      clearErrors("leave_restrictions.month_end_restrict_from_day");
    }

    if (!requireGapBetweenLeaveRequests) {
      clearErrors("leave_restrictions.min_gap_days");
    }

    if (!hasMonthlyFrequencyLimit) {
      clearErrors("leave_restrictions.max_instances_per_month");
    }

    if (!hasYearlyFrequencyLimit) {
      clearErrors("leave_restrictions.max_instances_per_year");
    }
  }, [
    requireDocumentProof,
    isPriorNoticeRequired,
    isAllowApplyingPreviousLeaves,
    isRequireMaxPriorNotice,
    hasRestrictedLeaveTypePairs,
    hasConsecutiveDaysLimit,
    hasMonthlyConsumptionLimit,
    restrictMonthEndLeave,
    requireGapBetweenLeaveRequests,
    hasMonthlyFrequencyLimit,
    hasYearlyFrequencyLimit,
  ]);

  const {
    max_consecutive_days_allowed,
    max_leave_consumption_per_month_days,
    month_end_restrict_from_day,
    min_gap_days,
    max_instances_per_month,
    max_instances_per_year,
  } = errors.leave_restrictions ?? {};

  return (
    <Stack gap="20px">
      <Typography variant="h5">Leave Usage</Typography>

      <Stack gap="20px">
        <Stack direction="row" gap="10px" alignItems="baseline">
          <CheckBox
            name="leave_restrictions.has_consecutive_days_limit"
            control={control}
            size="small"
            sx={{ top: "4px" }}
            disabled={disabled}
          />

          <Stack gap="10px" alignItems="baseline" direction="row">
            <Typography>An employee cannot take more than </Typography>

            <TextField
              sx={{ maxWidth: "150px" }}
              type="number"
              name="leave_restrictions.max_consecutive_days_allowed"
              control={control}
              label=""
              disabled={!hasConsecutiveDaysLimit || disabled}
              error={!!max_consecutive_days_allowed}
              helperText={errorMessages(max_consecutive_days_allowed?.message)}
            />

            <Typography> consecutive days of leave. </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" gap="10px" alignItems="baseline">
          <CheckBox
            name="leave_restrictions.has_monthly_consumption_limit"
            control={control}
            size="small"
            sx={{ top: "4px" }}
            disabled={disabled}
          />

          <Stack gap="10px" alignItems="baseline" direction="row">
            <Typography>An employee cannot take more than </Typography>

            <TextField
              sx={{ maxWidth: "150px" }}
              type="number"
              name="leave_restrictions.max_leave_consumption_per_month_days"
              control={control}
              label=""
              disabled={!hasMonthlyConsumptionLimit || disabled}
              error={!!max_leave_consumption_per_month_days}
              helperText={errorMessages(
                max_leave_consumption_per_month_days?.message
              )}
            />

            <Typography> days of leave in a month. </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" gap="10px" alignItems="baseline">
          <CheckBox
            name="leave_restrictions.restrict_month_end_leave"
            control={control}
            size="small"
            sx={{ top: "4px" }}
            disabled={disabled}
          />

          <Stack gap="10px" alignItems="baseline" direction="row">
            <Typography>An employees cannot request leave from the</Typography>

            <CustomDayAutoComplete
              sx={{ width: "140px" }}
              required
              name="leave_restrictions.month_end_restrict_from_day"
              control={control}
              disabled={!restrictMonthEndLeave || disabled}
              error={!!month_end_restrict_from_day}
              helperText={errorMessages(month_end_restrict_from_day?.message)}
            />

            <Typography> th day to the end of the month. </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" gap="10px" alignItems="baseline">
          <CheckBox
            name="leave_restrictions.require_gap_between_leave_requests"
            control={control}
            size="small"
            sx={{ top: "4px" }}
            disabled={disabled}
          />

          <Stack gap="10px" alignItems="baseline" direction="row">
            <Typography>
              Minimum Leave gap required between two application is
            </Typography>

            <TextField
              sx={{ maxWidth: "150px" }}
              type="number"
              name="leave_restrictions.min_gap_days"
              control={control}
              label=""
              disabled={!requireGapBetweenLeaveRequests || disabled}
              error={!!min_gap_days}
              helperText={errorMessages(min_gap_days?.message)}
            />

            <Typography> calender days. </Typography>
          </Stack>
        </Stack>

        <Stack gap="10px">
          <Typography>How many times can this leave be taken?</Typography>

          <Stack direction="row" gap="10px" alignItems="baseline">
            <CheckBox
              name="leave_restrictions.has_monthly_frequency_limit"
              control={control}
              size="small"
              sx={{ top: "4px" }}
              disabled={disabled}
            />

            <Stack gap="10px" alignItems="baseline" direction="row">
              <Typography>Set Monthly frequency limit</Typography>

              <TextField
                sx={{ maxWidth: "170px" }}
                type="number"
                name="leave_restrictions.max_instances_per_month"
                control={control}
                label=""
                disabled={!hasMonthlyFrequencyLimit || disabled}
                error={!!max_instances_per_month}
                helperText={errorMessages(max_instances_per_month?.message)}
              />
            </Stack>
          </Stack>

          <Stack direction="row" gap="10px" alignItems="baseline">
            <CheckBox
              name="leave_restrictions.has_yearly_frequency_limit"
              control={control}
              size="small"
              sx={{ top: "4px" }}
              disabled={disabled}
            />

            <Stack gap="10px" alignItems="baseline" direction="row">
              <Typography>Set Yearly frequency limit</Typography>

              <TextField
                sx={{ maxWidth: "170px" }}
                type="number"
                name="leave_restrictions.max_instances_per_year"
                control={control}
                label=""
                disabled={!hasYearlyFrequencyLimit || disabled}
                error={!!max_instances_per_year}
                helperText={errorMessages(max_instances_per_year?.message)}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

import { CheckBox, RadioGroupField } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import type { ConfigureLeaveFormFieldValues } from "../../ConfigureLeaveForm";
import { useGetBalanceRoundOfRadioOptions } from "../hooks/useGetBalanceRoundOfRadioOptions";
import { useGetExitingProrateQuotaRadioOptions } from "../hooks/useGetExitingProrateQuotaRadioOptions";

const exitingLeaveAccrualProrateQuotaSchema = z.enum([
  "based_on_exit_date",
  "based_on_range_of_date",
  "do_not_accrual",
]);

const leaveBalanceRoundOffTypeSchema = z.enum([
  "nearest_half_day",
  "nearest_full_day",
  "ceiling_half_day",
  "ceiling_full_day",
  "none",
]);

export const LeaveProrateLastMonthFormSchema = z
  .object({
    allowed_leave_accrual_during_notice_period: z.boolean(),
    exiting_leave_accrual_prorate_quota: exitingLeaveAccrualProrateQuotaSchema,
    exiting_prorated_credit_rules: z
      .array(
        z
          .object({
            from_date: z.number().nullable(),
            to_date: z.number().nullable(),
            rate: z
              .number()
              .int({ message: "Days should not be in point." })
              .min(1, { message: "day must be greater then 0" })
              .nullable(),
          })
          .optional()
      )
      .nullable(),
    leave_balance_round_off_type: leaveBalanceRoundOffTypeSchema.nullable(),
  })
  .superRefine((data, ctx) => {
    if (
      data.exiting_leave_accrual_prorate_quota === "based_on_range_of_date" &&
      data.exiting_prorated_credit_rules?.length
    ) {
      // eslint-disable-next-line sonarjs/cognitive-complexity
      data.exiting_prorated_credit_rules.forEach((item, index) => {
        if (item) {
          if (!item.from_date) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [`exiting_prorated_credit_rules.${index}.from_date`],
              message: "common.required",
            });
          }

          if (!item.to_date) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [`exiting_prorated_credit_rules.${index}.to_date`],
              message: "common.required",
            });
          }

          if (!item.rate) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [`exiting_prorated_credit_rules.${index}.rate`],
              message: "common.required",
            });
          }

          if (item.rate && item.rate > 365) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [`exiting_prorated_credit_rules.${index}.rate`],
              message: "Days should not be more then 365",
            });
          }

          if (
            item?.from_date &&
            item?.to_date &&
            item.from_date > item.to_date
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [`exiting_prorated_credit_rules.${index}.from_date`],
              message: "Start date should be less then to date",
            });
          }

          if (
            item?.from_date &&
            item?.to_date &&
            item.from_date > item.to_date
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [`exiting_prorated_credit_rules.${index}.to_date`],
              message: "to date should be more then start date",
            });
          }
        }

        if (data.exiting_prorated_credit_rules?.length) {
          const prevRule = data.exiting_prorated_credit_rules[index - 1];

          if (
            prevRule?.to_date != null &&
            item?.from_date != null &&
            prevRule.to_date >= item.from_date
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [`exiting_prorated_credit_rules.${index}.from_date`],
              message: "Selected Day should be greater than previous to day",
            });
          }
        }
      });
    }
  });

export type LeaveProrateLastMonthFormFieldValues = z.infer<
  typeof LeaveProrateLastMonthFormSchema
>;

export const leaveProrateLastMonthFormDefaultValues: LeaveProrateLastMonthFormFieldValues =
  {
    allowed_leave_accrual_during_notice_period: false,
    exiting_leave_accrual_prorate_quota: "based_on_exit_date",
    exiting_prorated_credit_rules: [
      {
        from_date: null,
        to_date: null,
        rate: null,
      },
    ],
    leave_balance_round_off_type: "none",
  };

type LeaveProrateLastMonthFormProps = {
  disabled?: boolean;
};

export const LeaveProrateLastMonthForm = ({
  disabled = false,
}: LeaveProrateLastMonthFormProps) => {
  const { control, watch, clearErrors, setError } =
    useFormContext<ConfigureLeaveFormFieldValues>();

  const exitingLeaveAccrualProrateQuota = watch(
    "leave_accrual_prorate.exiting_leave_accrual_prorate_quota"
  );

  const allowedLeaveAccrualDuringNoticePeriod = watch(
    "leave_accrual_prorate.allowed_leave_accrual_during_notice_period"
  );

  const exitingProratedCreditRules = watch(
    "leave_accrual_prorate.exiting_prorated_credit_rules"
  );

  const accrualType = watch("leave_accrual.accrual_type");

  const isUnevenlyAccrued = watch("leave_accrual.is_unevenly_accrued");

  useEffect(() => {
    if (
      exitingLeaveAccrualProrateQuota !== "based_on_range_of_date" ||
      allowedLeaveAccrualDuringNoticePeriod
    ) {
      clearErrors("leave_accrual_prorate.exiting_prorated_credit_rules");
    }
  }, [exitingLeaveAccrualProrateQuota, allowedLeaveAccrualDuringNoticePeriod]);

  useEffect(() => {
    exitingProratedCreditRules?.forEach((item, index) => {
      if (exitingProratedCreditRules?.length) {
        const prevRule = exitingProratedCreditRules[index - 1];

        if (
          prevRule?.to_date != null &&
          item?.from_date != null &&
          prevRule.to_date >= item.from_date
        ) {
          setError(
            `leave_accrual_prorate.exiting_prorated_credit_rules.${index}.from_date`,
            {
              type: "custom",
              message: "Selected Day should be greater than previous to day",
            }
          );
        } else {
          clearErrors(
            `leave_accrual_prorate.exiting_prorated_credit_rules.${index}.from_date`
          );
        }
      }
    });
  }, [JSON.stringify(exitingProratedCreditRules)]);

  const { exitingProrateQuotaRadioOptions } =
    useGetExitingProrateQuotaRadioOptions({
      isUnevenlyAccrued,
      accrualType,
      disabled,
    });

  const { balanceRoundOfRadioOptions } = useGetBalanceRoundOfRadioOptions({
    disabled,
  });

  return (
    <Stack gap="15px">
      <Typography variant="h5">
        Leave Proration During Last Month(Exit)
      </Typography>

      <Stack direction="row" gap="10px">
        <CheckBox
          name="leave_accrual_prorate.allowed_leave_accrual_during_notice_period"
          control={control}
          size="small"
          disabled={disabled}
        />

        <Typography>
          How Leave is prorated for employees in last month based on their exit
          date.
        </Typography>
      </Stack>

      {allowedLeaveAccrualDuringNoticePeriod && (
        <RadioGroupField
          name="leave_accrual_prorate.exiting_leave_accrual_prorate_quota"
          label=""
          control={control}
          direction="column"
          sx={{
            alignItems: "start",
          }}
          options={exitingProrateQuotaRadioOptions}
          disabled={disabled}
        />
      )}

      <RadioGroupField
        name="leave_accrual_prorate.leave_balance_round_off_type"
        label="Round Off Leave Balances During Proration"
        control={control}
        direction="column"
        sx={{
          alignItems: "start",
        }}
        options={balanceRoundOfRadioOptions}
      />
    </Stack>
  );
};

import {
  CheckBox,
  PadBox,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { DateEventAutocomplete } from "../../../../../../../common/Autocomplete/DateEventAutocomplete";
import type { ConfigureLeaveFormFieldValues } from "../../ConfigureLeaveForm";
import { LeaveRulesForm, LeaveRulesFormSchema } from "./LeaveRulesForm";

const joiningProrateQuotaSchema = z.enum([
  "range_of_joining_date",
  "date_of_joining",
]);

const probationEndProrateQuotaSchema = z.enum([
  "probation_end_date",
  "range_of_probation_end",
]);

const leaveAccrualQuotaType = z.enum(["after_days", "immediately"]);

export const LeaveProrateFirstMonthSchema = z
  .object({
    is_prorate_in_first_month: z.boolean(),
    joining_prorate_quota: joiningProrateQuotaSchema,
    joining_prorated_credit_rules: LeaveRulesFormSchema,
    is_leave_accrual_during_probation: z.boolean(),
    days_to_start_accrual_after_joining: z
      .number()
      .int({ message: "Days should not be in point." })
      .nullable(),
    days_to_start_accrual_after_probation: z
      .number()
      .int({ message: "Days should not be in point." })
      .nullable(),
    probation_end_prorate_quota: probationEndProrateQuotaSchema,
    probation_end_prorated_credit_rules: LeaveRulesFormSchema,
    leave_accrual_during_probation_quota: leaveAccrualQuotaType,
    leave_accrual_start_after_probation_quota: leaveAccrualQuotaType,
  })
  .superRefine((data, ctx) => {
    if (
      data.is_prorate_in_first_month &&
      data.joining_prorate_quota == "range_of_joining_date" &&
      data.joining_prorated_credit_rules?.length
    ) {
      data.joining_prorated_credit_rules.forEach((item, index) => {
        if (!item?.from_date) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [`joining_prorated_credit_rules.${index}.from_date`],
            message: "common.required",
          });
        }

        if (!item?.to_date) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [`joining_prorated_credit_rules.${index}.to_date`],
            message: "common.required",
          });
        }

        if (item?.rate == null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [`joining_prorated_credit_rules.${index}.rate`],
            message: "common.required",
          });
        }

        if (item?.rate != null && item.rate % 0.5 !== 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [`joining_prorated_credit_rules.${index}.rate`],
            message: "Rate should be in intervals of 0.5.",
          });
        }

        if (data.joining_prorated_credit_rules?.length) {
          const prevRule = data.joining_prorated_credit_rules[index - 1];

          if (
            prevRule?.to_date != null &&
            item?.from_date != null &&
            prevRule.to_date >= item.from_date
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [`joining_prorated_credit_rules.${index}.from_date`],
              message: "Selected Day should be greater than previous to day",
            });
          }
        }
      });
    }

    if (
      data.probation_end_prorate_quota == "range_of_probation_end" &&
      data.probation_end_prorated_credit_rules?.length
    ) {
      data.probation_end_prorated_credit_rules.forEach((item, index) => {
        if (!item?.from_date) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [`probation_end_prorated_credit_rules.${index}.from_date`],
            message: "common.required",
          });
        }

        if (!item?.to_date) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [`probation_end_prorated_credit_rules.${index}.to_date`],
            message: "common.required",
          });
        }

        if (item?.rate == null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [`probation_end_prorated_credit_rules.${index}.rate`],
            message: "common.required",
          });
        }
      });
    }

    if (
      data.leave_accrual_start_after_probation_quota == "after_days" &&
      data.days_to_start_accrual_after_probation == null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["days_to_start_accrual_after_probation"],
        message: "common.required",
      });
    }

    if (
      data.leave_accrual_start_after_probation_quota == "after_days" &&
      data.days_to_start_accrual_after_probation &&
      data.days_to_start_accrual_after_probation > 365
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["days_to_start_accrual_after_probation"],
        message: "Days should not be more then 365",
      });
    }

    if (
      data.is_leave_accrual_during_probation &&
      data.leave_accrual_during_probation_quota == "after_days" &&
      data.days_to_start_accrual_after_joining == null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["days_to_start_accrual_after_joining"],
        message: "common.required",
      });
    }

    if (
      data.is_leave_accrual_during_probation &&
      data.leave_accrual_during_probation_quota == "after_days" &&
      data.days_to_start_accrual_after_joining &&
      data.days_to_start_accrual_after_joining > 365
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["days_to_start_accrual_after_joining"],
        message: "Days should not be more then 365",
      });
    }
  });

export type LeaveProrateFirstMonthFormFieldValues = z.infer<
  typeof LeaveProrateFirstMonthSchema
>;

export const leaveProrateFirstMonthFormDefaultValues: LeaveProrateFirstMonthFormFieldValues =
  {
    is_prorate_in_first_month: false,
    joining_prorate_quota: "date_of_joining",
    joining_prorated_credit_rules: [
      {
        from_date: null,
        to_date: null,
        rate: null,
      },
    ],
    is_leave_accrual_during_probation: false,
    days_to_start_accrual_after_joining: null,
    days_to_start_accrual_after_probation: null,
    probation_end_prorate_quota: "probation_end_date",
    probation_end_prorated_credit_rules: [
      {
        from_date: null,
        to_date: null,
        rate: null,
      },
    ],
    leave_accrual_during_probation_quota: "immediately",
    leave_accrual_start_after_probation_quota: "immediately",
  };

const restrictionBasedOnType = z.enum([
  "date_of_joining",
  "probation_end_date",
]);

export const NewJoinerRequestLeaveSchema = z
  .object({
    days_after_leave_allowed: z
      .number()
      .int({ message: "Days should not be in point." })
      .nullable()
      .optional(),
    limit_leave_days_in_probation: z.boolean(),
    max_leave_days_in_probation: z
      .number()
      .int({ message: "Days should not be in point." })
      .nullable(),
    restrict_leave_before_days: z.boolean(),
    restriction_based_on: restrictionBasedOnType,
  })
  .superRefine((data, ctx) => {
    if (
      data.limit_leave_days_in_probation &&
      data.max_leave_days_in_probation == null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_leave_days_in_probation"],
        message: "common.required",
      });
    }

    if (
      data.limit_leave_days_in_probation &&
      data.max_leave_days_in_probation &&
      data.max_leave_days_in_probation > 365
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_leave_days_in_probation"],
        message: "Days should not be more then 36sss5",
      });
    }

    if (
      data.limit_leave_days_in_probation &&
      data.max_leave_days_in_probation == 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_leave_days_in_probation"],
        message: "Days should be more then 0",
      });
    }

    if (
      data.restrict_leave_before_days &&
      data.days_after_leave_allowed == null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["days_after_leave_allowed"],
        message: "common.required",
      });
    }

    if (data.restrict_leave_before_days && data.days_after_leave_allowed == 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["days_after_leave_allowed"],
        message: "Days should be more then 0",
      });
    }

    if (
      data.restrict_leave_before_days &&
      data.days_after_leave_allowed &&
      data.days_after_leave_allowed > 365
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["days_after_leave_allowed"],
        message: "Days should not be more then 365",
      });
    }
  });

export type newJoinerRequestLeaveFormFieldValues = z.infer<
  typeof NewJoinerRequestLeaveSchema
>;

export const newJoinerRequestLeaveFromDefaultValues: newJoinerRequestLeaveFormFieldValues =
  {
    days_after_leave_allowed: null,
    limit_leave_days_in_probation: false,
    max_leave_days_in_probation: null,
    restrict_leave_before_days: false,
    restriction_based_on: "date_of_joining",
  };

type LeaveProrateFirstMonthFormProps = {
  disabled?: boolean;
  formType: string;
};

export const LeaveProrateFirstMonthForm = ({
  disabled = false,
  formType,
}: LeaveProrateFirstMonthFormProps) => {
  const theme = useTheme();

  const { mirage, iron } = theme.palette.app.color;

  const {
    control,
    watch,
    setValue,
    formState: { errors },
    clearErrors,
    setError,
  } = useFormContext<ConfigureLeaveFormFieldValues>();

  //TODO: Nikhil handle all Multiple Watch and errors with common methods

  const isProrateInFirstMonth = watch(
    "leave_accrual_prorate.is_prorate_in_first_month"
  );

  const joiningProrateQuota = watch(
    "leave_accrual_prorate.joining_prorate_quota"
  );

  const isLeaveAccrualDuringProbation = watch(
    "leave_accrual_prorate.is_leave_accrual_during_probation"
  );

  const leaveAccrualStartAfterProbationQuota = watch(
    "leave_accrual_prorate.leave_accrual_start_after_probation_quota"
  );

  const daysToStartAccrualAfterProbation = watch(
    "leave_accrual_prorate.days_to_start_accrual_after_probation"
  );

  const leaveAccrualDuringProbationQuota = watch(
    "leave_accrual_prorate.leave_accrual_during_probation_quota"
  );

  const probationEndProrateQuota = watch(
    "leave_accrual_prorate.probation_end_prorate_quota"
  );

  const joiningProratedCreditRules = watch(
    "leave_accrual_prorate.joining_prorated_credit_rules"
  );

  const limitLeaveDaysInProbation = watch(
    "leave_restrictions.limit_leave_days_in_probation"
  );

  const restrictLeaveBeforeDays = watch(
    "leave_restrictions.restrict_leave_before_days"
  );

  const restrictionBasedOn = watch("leave_restrictions.restriction_based_on");

  const accrualType = watch("leave_accrual.accrual_type");

  const isUnevenlyAccrued = watch("leave_accrual.is_unevenly_accrued");

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  useEffect(() => {
    if (
      !isProrateInFirstMonth ||
      joiningProrateQuota !== "range_of_joining_date"
    ) {
      clearErrors("leave_accrual_prorate.joining_prorated_credit_rules");
    }
  }, [isProrateInFirstMonth, joiningProrateQuota]);

  useEffect(() => {
    if (
      !isLeaveAccrualDuringProbation ||
      leaveAccrualDuringProbationQuota !== "after_days"
    ) {
      clearErrors("leave_accrual_prorate.days_to_start_accrual_after_joining");
    }
  }, [isLeaveAccrualDuringProbation, leaveAccrualDuringProbationQuota]);

  useEffect(() => {
    if (
      leaveAccrualStartAfterProbationQuota === "immediately" &&
      !daysToStartAccrualAfterProbation
    ) {
      clearErrors(
        "leave_accrual_prorate.days_to_start_accrual_after_probation"
      );
    }
  }, [leaveAccrualStartAfterProbationQuota]);

  useEffect(() => {
    if (!restrictLeaveBeforeDays) {
      clearErrors("leave_restrictions.days_after_leave_allowed");
    }
  }, [restrictLeaveBeforeDays]);

  useEffect(() => {
    if (!limitLeaveDaysInProbation) {
      clearErrors("leave_restrictions.max_leave_days_in_probation");
    }
  }, [limitLeaveDaysInProbation]);

  useEffect(() => {
    if (isUnevenlyAccrued) {
      setValue("leave_accrual_prorate.is_leave_accrual_during_probation", true);
      setValue(
        "leave_accrual_prorate.joining_prorate_quota",
        "date_of_joining"
      );
    }
  }, [isUnevenlyAccrued]);

  useEffect(() => {
    if (restrictionBasedOn == "probation_end_date") {
      setValue("leave_restrictions.limit_leave_days_in_probation", false);
    }
  }, [restrictionBasedOn]);

  useEffect(() => {
    if (accrualType === "periodically" && isUnevenlyAccrued) {
      setValue("leave_accrual_prorate.is_prorate_in_first_month", false);
    }
  }, [accrualType, isUnevenlyAccrued]);

  useEffect(() => {
    joiningProratedCreditRules?.forEach((item, index) => {
      if (joiningProratedCreditRules?.length) {
        const prevRule = joiningProratedCreditRules[index - 1];

        if (
          prevRule?.to_date != null &&
          item?.from_date != null &&
          prevRule.to_date >= item.from_date
        ) {
          setError(
            `leave_accrual_prorate.joining_prorated_credit_rules.${index}.from_date`,
            {
              type: "custom",
              message: "Selected Day should be greater than previous to day",
            }
          );
        } else {
          clearErrors(
            `leave_accrual_prorate.joining_prorated_credit_rules.${index}.from_date`
          );
        }
      }
    });
  }, [JSON.stringify(joiningProratedCreditRules)]);

  const {
    days_to_start_accrual_after_joining,
    days_to_start_accrual_after_probation,
  } = errors.leave_accrual_prorate ?? {};

  const { days_after_leave_allowed, max_leave_days_in_probation } =
    errors.leave_restrictions ?? {};

  const editFormType = formType === "edit";

  const isCommonActionDisabled = disabled || editFormType;

  return (
    <Stack gap="15px">
      <Typography variant="h5">
        Leave Proration During First Month(Join)
      </Typography>

      <Stack gap="10px">
        <Stack direction="row" gap="10px">
          <CheckBox
            name="leave_accrual_prorate.is_prorate_in_first_month"
            control={control}
            size="small"
            disabled={
              (accrualType == "periodically" && isUnevenlyAccrued) ||
              disabled ||
              editFormType
            }
          />

          <Typography fontWeight="500" color={mirage[500]}>
            Prorate leave during the first month of employment based on
          </Typography>
        </Stack>

        {isProrateInFirstMonth && (
          <PadBox padding={{ paddingLeft: "20px" }}>
            <RadioGroupField
              name="leave_accrual_prorate.joining_prorate_quota"
              label=""
              control={control}
              direction="column"
              sx={{
                alignItems: "start",
              }}
              options={[
                {
                  values: "date_of_joining",
                  label: (
                    <Box>
                      <Typography variant="body1" paddingTop="8px">
                        Date Of Joining
                      </Typography>
                    </Box>
                  ),
                  disabled: isCommonActionDisabled,
                },
                {
                  values: "range_of_joining_date",
                  label: (
                    <Stack gap="10px">
                      <Typography variant="body1" paddingTop="8px">
                        Range of date of joining
                      </Typography>

                      {joiningProrateQuota == "range_of_joining_date" && (
                        <Box
                          border="1px solid"
                          borderRadius="5px"
                          borderColor={iron[700]}
                          sx={{ cursor: "default" }}
                        >
                          <PadBox padding={{ padding: "20px" }}>
                            <LeaveRulesForm
                              leaveCategory="leave_accrual_prorate"
                              leaveSubCategory="joining_prorated_credit_rules"
                              buttonLabel="Add Range"
                              disabled={isCommonActionDisabled}
                            />
                          </PadBox>
                        </Box>
                      )}
                    </Stack>
                  ),
                  disabled: isCommonActionDisabled,
                },
              ]}
            />
          </PadBox>
        )}
      </Stack>

      {accrualType == "periodically" && (
        <>
          <Stack gap="10px">
            <Stack direction="row" gap="10px">
              <CheckBox
                name="leave_accrual_prorate.is_leave_accrual_during_probation"
                control={control}
                size="small"
                disabled={isUnevenlyAccrued || isCommonActionDisabled}
              />

              <Typography fontWeight="500" color={mirage[500]}>
                Accrue leave during probation
              </Typography>
            </Stack>

            {isLeaveAccrualDuringProbation && (
              <PadBox padding={{ paddingLeft: "20px" }}>
                <RadioGroupField
                  name="leave_accrual_prorate.leave_accrual_during_probation_quota"
                  label=""
                  control={control}
                  direction="column"
                  sx={{
                    alignItems: "start",
                  }}
                  options={[
                    {
                      label: (
                        <Box>
                          <Typography variant="body1" paddingTop="8px">
                            Starting immediately
                          </Typography>
                        </Box>
                      ),
                      values: "immediately",
                      disabled: isUnevenlyAccrued || isCommonActionDisabled,
                    },
                    {
                      values: "after_days",
                      label: (
                        <Stack
                          gap="10px"
                          flexDirection="row"
                          alignItems="baseline"
                        >
                          <Typography variant="body1" paddingTop="8px">
                            Starting after
                          </Typography>

                          <TextField
                            type="number"
                            name="leave_accrual_prorate.days_to_start_accrual_after_joining"
                            control={control}
                            sx={{ width: "140px" }}
                            disabled={
                              leaveAccrualDuringProbationQuota ==
                                "immediately" ||
                              disabled ||
                              editFormType
                            }
                            error={!!days_to_start_accrual_after_joining}
                            helperText={errorMessages(
                              days_to_start_accrual_after_joining?.message
                            )}
                          />

                          <Typography>
                            days from the date of joining.
                          </Typography>
                        </Stack>
                      ),
                      disabled: isUnevenlyAccrued || isCommonActionDisabled,
                    },
                  ]}
                />
              </PadBox>
            )}
          </Stack>

          {!isLeaveAccrualDuringProbation && (
            <>
              <RadioGroupField
                name="leave_accrual_prorate.leave_accrual_start_after_probation_quota"
                label="After probation ends, start accrual:"
                control={control}
                direction="column"
                sx={{
                  alignItems: "start",
                }}
                options={[
                  {
                    label: (
                      <Stack
                        gap="10px"
                        flexDirection="row"
                        alignItems="baseline"
                      >
                        <Typography variant="body1" paddingTop="8px">
                          After a waiting period of
                        </Typography>

                        <TextField
                          type="number"
                          name="leave_accrual_prorate.days_to_start_accrual_after_probation"
                          control={control}
                          sx={{ width: "140px" }}
                          disabled={
                            leaveAccrualStartAfterProbationQuota ===
                              "immediately" || disabled
                          }
                          error={!!days_to_start_accrual_after_probation}
                          helperText={errorMessages(
                            days_to_start_accrual_after_probation?.message
                          )}
                        />

                        <Typography>days.</Typography>
                      </Stack>
                    ),
                    values: "after_days",
                    disabled: isCommonActionDisabled,
                  },
                  {
                    values: "immediately",
                    label: (
                      <Box>
                        <Typography variant="body1" paddingTop="8px">
                          Immediately
                        </Typography>
                      </Box>
                    ),
                    disabled: isCommonActionDisabled,
                  },
                ]}
              />

              <RadioGroupField
                name="leave_accrual_prorate.probation_end_prorate_quota"
                label="Prorate leave after probation end based on:"
                control={control}
                direction="column"
                sx={{
                  alignItems: "start",
                }}
                options={[
                  {
                    label: (
                      <Box>
                        <Typography variant="body1" paddingTop="8px">
                          Probation end date
                        </Typography>
                      </Box>
                    ),
                    values: "probation_end_date",
                    disabled: isCommonActionDisabled,
                  },
                  {
                    values: "range_of_probation_end",
                    label: (
                      <Stack gap="10px">
                        <Typography variant="body1" paddingTop="8px">
                          Range of probation end date.
                        </Typography>

                        {probationEndProrateQuota ==
                          "range_of_probation_end" && (
                          <Box
                            border="1px solid"
                            borderRadius="5px"
                            borderColor={iron[700]}
                            sx={{ cursor: "default" }}
                          >
                            <PadBox padding={{ padding: "20px" }}>
                              <LeaveRulesForm
                                leaveCategory="leave_accrual_prorate"
                                leaveSubCategory="probation_end_prorated_credit_rules"
                                buttonLabel="Add Range"
                                disabled={isCommonActionDisabled}
                              />
                            </PadBox>
                          </Box>
                        )}
                      </Stack>
                    ),
                    disabled: isCommonActionDisabled,
                  },
                ]}
              />
            </>
          )}
        </>
      )}

      <Typography fontWeight="500" color={mirage[500]}>
        Leave Application During Probation
      </Typography>

      <Stack direction="row" gap="10px" alignItems="baseline">
        <CheckBox
          name="leave_restrictions.restrict_leave_before_days"
          control={control}
          size="small"
          sx={{ top: "3px" }}
          disabled={disabled}
        />

        <Stack flexDirection="row" gap="10px">
          <Typography sx={{ paddingTop: "9px" }}>
            New joiners are eligible to request leave after
          </Typography>

          <TextField
            type="number"
            name="leave_restrictions.days_after_leave_allowed"
            control={control}
            sx={{ width: "140px" }}
            error={!!days_after_leave_allowed}
            disabled={!restrictLeaveBeforeDays || disabled}
            helperText={errorMessages(days_after_leave_allowed?.message)}
          />

          <Typography sx={{ paddingTop: "9px" }}>days of their</Typography>

          <DateEventAutocomplete
            control={control}
            name="leave_restrictions.restriction_based_on"
            sx={{ width: "200px" }}
            disabled={!restrictLeaveBeforeDays || disabled}
            clearIcon
          />
        </Stack>
      </Stack>

      <Stack direction="row" gap="10px" alignItems="baseline">
        <CheckBox
          name="leave_restrictions.limit_leave_days_in_probation"
          control={control}
          size="small"
          sx={{ top: "3px" }}
          disabled={
            (!!restrictLeaveBeforeDays &&
              restrictionBasedOn == "probation_end_date") ||
            disabled
          }
        />

        <Stack flexDirection="row" gap="10px" alignItems="baseline">
          <Typography>Maximum </Typography>

          <TextField
            type="number"
            name="leave_restrictions.max_leave_days_in_probation"
            control={control}
            sx={{ width: "140px" }}
            error={!!max_leave_days_in_probation}
            helperText={errorMessages(max_leave_days_in_probation?.message)}
            disabled={
              !limitLeaveDaysInProbation ||
              (!!restrictLeaveBeforeDays &&
                restrictionBasedOn == "probation_end_date") ||
              disabled
            }
          />

          <Typography>days of leave is allowed during probation</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

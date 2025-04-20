import {
  Button,
  CheckBox,
  DeleteAction,
  PadBox,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { LeaveTypeCategoryAutocomplete } from "../../../../../../../common/Autocomplete/LeaveTypeCategoryAutocomplete";
import type { ConfigureLeaveFormFieldValues } from "../../ConfigureLeaveForm";
import { useGetDocumentRequiredRadioOptions } from "../hooks/useGetDocumentRequiredRadioOptions";

type leaveApplicationFormProps = {
  leavePlanId: string;
  leaveTypeId: string;
  disabled: boolean;
};

export const LeaveApplicationInQuotaSchema = z
  .object({
    is_restrict_apply_leave_in_credited_year: z.boolean(),
    has_restricted_leave_type_pairs: z.boolean(),
    restricted_leave_type_ids: z.array(z.string()).nullable(),
  })
  .superRefine((data, ctx) => {
    if (
      data.has_restricted_leave_type_pairs &&
      !data.restricted_leave_type_ids?.length
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["restricted_leave_type_ids"],
        message: "common.required",
      });
    }
  });

export const LeaveApplicationSchema = z
  .object({
    allow_half_day: z.boolean(),
    is_document_required: z.boolean(),
    document_required_after_days: z
      .number()
      .int({ message: "Days should not be in point." })
      .nullable(),
    is_prior_notice_required: z.boolean(),
    prior_notice_ranges: z
      .array(
        z
          .object({
            leave_duration_in_calendar_days: z.number().nullable(),
            prior_notice_calendar_days: z
              .number()
              .max(365, { message: "Days should not be more then 365" })
              .nullable(),
            prior_notice_working_days: z
              .number()
              .max(365, { message: "Days should not be more then 365" })
              .nullable(),
          })
          .optional()
      )
      .nullable(),
    is_enable_applying_previous_leaves: z.boolean(),
    is_allow_applying_previous_leaves: z.boolean(),
    max_allowed_days_for_previous_leave: z
      .number()
      .int({ message: "Days should not be in point." })
      .nullable(),
    is_note_required: z.boolean(),
    is_require_max_prior_notice: z.boolean(),
    max_prior_notice_days: z
      .number()
      .int({ message: "Days should not be in point." })
      .nullable(),
  })
  // eslint-disable-next-line sonarjs/cognitive-complexity
  .superRefine((data, ctx) => {
    if (
      data.is_document_required &&
      data.document_required_after_days === null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["document_required_after_days"],
        message: "common.required",
      });
    }

    if (data.is_document_required && data.document_required_after_days === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["document_required_after_days"],
        message: "Days should be more then 0",
      });
    }

    if (
      data.is_document_required &&
      data.document_required_after_days &&
      data.document_required_after_days > 365
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["document_required_after_days"],
        message: "Days should not be more then 365",
      });
    }

    if (
      data.is_enable_applying_previous_leaves &&
      data.is_allow_applying_previous_leaves &&
      data.max_allowed_days_for_previous_leave === null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_allowed_days_for_previous_leave"],
        message: "common.required",
      });
    }

    if (
      data.is_enable_applying_previous_leaves &&
      data.is_allow_applying_previous_leaves &&
      data.max_allowed_days_for_previous_leave === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_allowed_days_for_previous_leave"],
        message: "Days should be more then 0",
      });
    }

    if (
      data.is_enable_applying_previous_leaves &&
      data.is_allow_applying_previous_leaves &&
      data.max_allowed_days_for_previous_leave &&
      data.max_allowed_days_for_previous_leave > 365
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_allowed_days_for_previous_leave"],
        message: "Days should not be more then 365",
      });
    }

    if (
      data.is_require_max_prior_notice &&
      data.max_prior_notice_days === null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_prior_notice_days"],
        message: "common.required",
      });
    }

    if (data.is_require_max_prior_notice && data.max_prior_notice_days === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_prior_notice_days"],
        message: "Days should be more then 0",
      });
    }

    if (
      data.is_require_max_prior_notice &&
      data.max_prior_notice_days &&
      data.max_prior_notice_days > 365
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_prior_notice_days"],
        message: "Days should not be more then 365",
      });
    }

    if (data.is_prior_notice_required && data.prior_notice_ranges) {
      // eslint-disable-next-line sonarjs/no-ignored-return, sonarjs/array-callback-without-return, sonarjs/cognitive-complexity
      data.prior_notice_ranges.map((item, index) => {
        const leaveDurationInCalendarDays =
          item?.leave_duration_in_calendar_days &&
          item.leave_duration_in_calendar_days;

        const priorNoticeCalendarDays =
          item?.prior_notice_calendar_days && item.prior_notice_calendar_days;

        const priorNoticeWorkingDays =
          item?.prior_notice_working_days && item.prior_notice_working_days;

        if (leaveDurationInCalendarDays === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [
              `prior_notice_ranges.${index}.leave_duration_in_calendar_days`,
            ],
            message: "common.required",
          });
        }

        if (leaveDurationInCalendarDays && leaveDurationInCalendarDays > 365) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [
              `prior_notice_ranges.${index}.leave_duration_in_calendar_days`,
            ],
            message: "Days should not be more then 365",
          });
        }

        if (priorNoticeCalendarDays === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [`prior_notice_ranges.${index}.prior_notice_calendar_days`],
            message: "common.required",
          });
        }

        if (priorNoticeCalendarDays && priorNoticeCalendarDays > 365) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [`prior_notice_ranges.${index}.prior_notice_calendar_days`],
            message: "Days should not be more then 365",
          });
        }

        if (priorNoticeWorkingDays === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [`prior_notice_ranges.${index}.prior_notice_working_days`],
            message: "common.required",
          });
        }

        if (priorNoticeWorkingDays && priorNoticeWorkingDays > 365) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [`prior_notice_ranges.${index}.prior_notice_working_days`],
            message: "Days should not be more then 365",
          });
        }

        if (
          priorNoticeWorkingDays &&
          priorNoticeCalendarDays &&
          priorNoticeCalendarDays < priorNoticeWorkingDays
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [`prior_notice_ranges.${index}.prior_notice_working_days`],
            message: "Working day must me equal or less then calendar day",
          });
        }

        if (
          priorNoticeWorkingDays &&
          priorNoticeCalendarDays &&
          priorNoticeCalendarDays < priorNoticeWorkingDays
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [`prior_notice_ranges.${index}.prior_notice_calendar_days`],
            message: "Working day must me equal or less then calendar day",
          });
        }

        if (
          leaveDurationInCalendarDays &&
          leaveDurationInCalendarDays % 0.5 !== 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [
              `prior_notice_ranges.${index}.leave_duration_in_calendar_days`,
            ],
            message: "Only numbers in 0.5 interval are allowed.",
          });
        }

        if (index > 0) {
          const prevLeaveDurationInCalendarDays =
            data.prior_notice_ranges?.[index - 1]
              ?.leave_duration_in_calendar_days;

          if (
            leaveDurationInCalendarDays &&
            prevLeaveDurationInCalendarDays &&
            prevLeaveDurationInCalendarDays >= leaveDurationInCalendarDays
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [
                `prior_notice_ranges.${index}.leave_duration_in_calendar_days`,
              ],
              message: "Day should be grater then preview Notice Day ",
            });
          }
        }
      });
    }
  });

export type LeaveApplicationFormFieldValues = z.infer<
  typeof LeaveApplicationSchema
>;

export const leaveApplicationFormDefaultValues: LeaveApplicationFormFieldValues =
  {
    allow_half_day: true,
    is_document_required: false,
    document_required_after_days: null,
    is_prior_notice_required: false,
    prior_notice_ranges: [
      {
        leave_duration_in_calendar_days: null,
        prior_notice_calendar_days: null,
        prior_notice_working_days: null,
      },
    ],
    is_enable_applying_previous_leaves: false,
    is_allow_applying_previous_leaves: false,
    max_allowed_days_for_previous_leave: null,
    is_note_required: false,
    is_require_max_prior_notice: false,
    max_prior_notice_days: null,
  };

export const LeaveApplicationForm = ({
  leavePlanId,
  leaveTypeId,
  disabled = false,
}: leaveApplicationFormProps) => {
  const theme = useTheme();

  const { iron, mirage, sapphireBlue, black } = theme.palette.app.color;

  const {
    control,
    watch,
    setValue,
    clearErrors,
    resetField,
    formState: { errors },
  } = useFormContext<ConfigureLeaveFormFieldValues>();

  const isDocumentRequired = watch(
    "leave_application_and_usage.is_document_required"
  );

  const isPriorNoticeRequired = watch(
    "leave_application_and_usage.is_prior_notice_required"
  );

  const priorNoticeRanges =
    watch("leave_application_and_usage.prior_notice_ranges") ?? [];

  const isApplyingPreviousLeaves = watch(
    "leave_application_and_usage.is_enable_applying_previous_leaves"
  );

  const isAllowApplyingPreviousLeaves = watch(
    "leave_application_and_usage.is_allow_applying_previous_leaves"
  );

  const isRequireMaxPriorNotice = watch(
    "leave_application_and_usage.is_require_max_prior_notice"
  );

  const hasRestrictedLeaveTypePairs = watch(
    "leave_quota.has_restricted_leave_type_pairs"
  );

  const isSystemGenerated = watch("is_system_generated");

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const handleAddNotice = () => {
    if (priorNoticeRanges?.length) {
      priorNoticeRanges.push({
        leave_duration_in_calendar_days: null,
        prior_notice_calendar_days: null,
        prior_notice_working_days: null,
      });

      setValue(
        "leave_application_and_usage.prior_notice_ranges",
        priorNoticeRanges
      );
    }
  };

  const handleRemoveNotice = (index: number) => {
    if (priorNoticeRanges?.length) {
      const updatedArray = priorNoticeRanges.filter(
        (_: unknown, i: number) => i !== index
      );

      setValue("leave_application_and_usage.prior_notice_ranges", updatedArray);
    }
  };

  useMemo(() => {
    if (!isDocumentRequired) {
      clearErrors("leave_application_and_usage.document_required_after_days");
    }

    if (!isPriorNoticeRequired && priorNoticeRanges.length) {
      clearErrors("leave_application_and_usage.prior_notice_ranges");
    }

    if (!isApplyingPreviousLeaves) {
      resetField(
        "leave_application_and_usage.is_allow_applying_previous_leaves"
      );

      clearErrors(
        "leave_application_and_usage.max_allowed_days_for_previous_leave"
      );
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
  }, [
    isDocumentRequired,
    isPriorNoticeRequired,
    isAllowApplyingPreviousLeaves,
    isRequireMaxPriorNotice,
    hasRestrictedLeaveTypePairs,
    isApplyingPreviousLeaves,
  ]);

  useEffect(() => {
    if (priorNoticeRanges) {
      // eslint-disable-next-line sonarjs/no-ignored-return, sonarjs/array-callback-without-return
      priorNoticeRanges.forEach((item, index) => {
        const leaveDurationInCalendarDays =
          item?.leave_duration_in_calendar_days;

        const priorNoticeCalendarDays = item?.prior_notice_calendar_days;

        if (
          leaveDurationInCalendarDays &&
          priorNoticeCalendarDays &&
          leaveDurationInCalendarDays >= priorNoticeCalendarDays
        ) {
          clearErrors(
            `leave_application_and_usage.prior_notice_ranges.${index}.prior_notice_calendar_days`
          );
          clearErrors(
            `leave_application_and_usage.prior_notice_ranges.${index}.leave_duration_in_calendar_days`
          );
        }
      });
    }
  }, [JSON.stringify(priorNoticeRanges)]);

  const {
    prior_notice_ranges,
    max_allowed_days_for_previous_leave,
    max_prior_notice_days,
  } = errors.leave_application_and_usage ?? {};

  const { restricted_leave_type_ids } = errors.leave_quota ?? {};

  const { documentRequiredRadioOptions } = useGetDocumentRequiredRadioOptions({
    disabled,
  });

  return (
    <Stack gap="20px">
      <Typography variant="h5">Leave Application</Typography>

      <Stack gap="20px">
        <RadioGroupField
          name="leave_application_and_usage.allow_half_day"
          label="Allow Applying For a Half Day leave?"
          control={control}
          sx={{
            alignItems: "center",
          }}
          options={[
            {
              label: "Yes",
              values: true,
              disabled,
            },
            {
              values: false,
              label: "No",
              disabled,
            },
          ]}
        />

        <RadioGroupField
          name="leave_application_and_usage.is_document_required"
          label="is document proof attachment is required for leave application?"
          control={control}
          direction="column"
          sx={{
            alignItems: "flex-start",
          }}
          options={documentRequiredRadioOptions}
        />

        <Stack gap="20px">
          <Stack direction="row" gap="10px">
            <CheckBox
              name="leave_application_and_usage.is_prior_notice_required"
              control={control}
              size="small"
              disabled={disabled}
            />

            <Typography fontWeight="500" color={mirage[500]}>
              Is prior notice needed?
            </Typography>
          </Stack>

          {isPriorNoticeRequired && (
            <Box border="1px solid" borderRadius="5px" borderColor={iron[700]}>
              <PadBox padding={{ padding: "20px" }}>
                <Stack gap="30px">
                  {priorNoticeRanges.map((_, index) => {
                    return (
                      // used index in key, having issues in input filed focus while using uuidv4
                      <Stack
                        flexDirection="row"
                        gap="10px"
                        alignItems="baseline"
                        // eslint-disable-next-line sonarjs/no-array-index-key
                        key={index}
                      >
                        <Typography>A prior notice of</Typography>

                        <TextField
                          type="number"
                          name={`leave_application_and_usage.prior_notice_ranges.${index}.prior_notice_calendar_days`}
                          control={control}
                          sx={{ width: "140px" }}
                          error={
                            !!prior_notice_ranges?.[index]
                              ?.prior_notice_calendar_days
                          }
                          helperText={errorMessages(
                            prior_notice_ranges?.[index]
                              ?.prior_notice_calendar_days?.message
                          )}
                          disabled={disabled}
                        />

                        <Typography>calendar days and</Typography>

                        <TextField
                          type="number"
                          name={`leave_application_and_usage.prior_notice_ranges.${index}.prior_notice_working_days`}
                          control={control}
                          sx={{ width: "140px" }}
                          error={
                            !!prior_notice_ranges?.[index]
                              ?.prior_notice_working_days
                          }
                          helperText={errorMessages(
                            prior_notice_ranges?.[index]
                              ?.prior_notice_working_days?.message
                          )}
                          disabled={disabled}
                        />

                        <Typography>
                          working days is required for leave of
                        </Typography>

                        <TextField
                          type="number"
                          name={`leave_application_and_usage.prior_notice_ranges.${index}.leave_duration_in_calendar_days`}
                          control={control}
                          sx={{ width: "140px" }}
                          error={
                            !!prior_notice_ranges?.[index]
                              ?.leave_duration_in_calendar_days
                          }
                          helperText={errorMessages(
                            prior_notice_ranges?.[index]
                              ?.leave_duration_in_calendar_days?.message
                          )}
                          disabled={disabled}
                        />

                        <Typography>or more days.</Typography>

                        {!!index && (
                          <Box>
                            <DeleteAction
                              disabled={disabled}
                              onClick={() => handleRemoveNotice(index)}
                            />
                          </Box>
                        )}
                      </Stack>
                    );
                  })}

                  <Divider>
                    <Button
                      startIcon={<Add />}
                      onClick={() => handleAddNotice()}
                      disabled={
                        !!errors?.leave_application_and_usage
                          ?.prior_notice_ranges || disabled
                      }
                    >
                      Add Notice
                    </Button>
                  </Divider>
                </Stack>
              </PadBox>
            </Box>
          )}
          {!isSystemGenerated && (
            <Stack gap="20px">
              <Stack direction="row" gap="10px">
                <CheckBox
                  name="leave_application_and_usage.is_enable_applying_previous_leaves"
                  control={control}
                  size="small"
                  disabled={disabled}
                />

                <Typography fontWeight="500" color={mirage[500]}>
                  Is there a limit on backdated leave applications?
                </Typography>
              </Stack>

              {isApplyingPreviousLeaves && (
                <Box
                  border="1px solid"
                  borderRadius="5px"
                  borderColor={iron[700]}
                >
                  <PadBox padding={{ padding: "20px" }}>
                    <Stack direction="row" gap="20px" alignItems="baseline">
                      <CheckBox
                        name="leave_application_and_usage.is_allow_applying_previous_leaves"
                        control={control}
                        size="small"
                        sx={{ top: "4px" }}
                        disabled={disabled}
                      />

                      <Stack direction="row" gap="10px" alignItems="baseline">
                        <Typography> Allow within </Typography>

                        <TextField
                          type="number"
                          name="leave_application_and_usage.max_allowed_days_for_previous_leave"
                          control={control}
                          disabled={!isAllowApplyingPreviousLeaves || disabled}
                          error={!!max_allowed_days_for_previous_leave}
                          helperText={errorMessages(
                            max_allowed_days_for_previous_leave?.message
                          )}
                        />

                        <Typography> days of the leave request.</Typography>
                      </Stack>
                    </Stack>
                  </PadBox>
                </Box>
              )}

              <Stack direction="row" gap="10px">
                <CheckBox
                  name="leave_application_and_usage.is_note_required"
                  control={control}
                  size="small"
                  disabled={disabled}
                />

                <Typography>
                  Is a comment mandatory when requesting leave?
                </Typography>
              </Stack>

              <Stack direction="row" gap="10px" alignItems="baseline">
                <CheckBox
                  name="leave_application_and_usage.is_require_max_prior_notice"
                  control={control}
                  size="small"
                  sx={{ top: "4px" }}
                  disabled={disabled}
                />

                <Stack gap="10px" alignItems="baseline" direction="row">
                  <Typography>
                    Leave applications cannot be submitted earlier than
                  </Typography>

                  <TextField
                    sx={{ maxWidth: "150px" }}
                    type="number"
                    name="leave_application_and_usage.max_prior_notice_days"
                    control={control}
                    label=""
                    disabled={!isRequireMaxPriorNotice || disabled}
                    error={!!max_prior_notice_days}
                    helperText={errorMessages(max_prior_notice_days?.message)}
                  />

                  <Typography> day before the leave start date. </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" gap="10px" alignItems="baseline">
                <CheckBox
                  name="leave_quota.has_restricted_leave_type_pairs"
                  control={control}
                  size="small"
                  sx={{ top: "4px" }}
                  disabled={disabled}
                />

                <Stack gap="10px" alignItems="baseline" direction="row">
                  <Typography>This leave cannot be used with</Typography>

                  <LeaveTypeCategoryAutocomplete
                    name="leave_quota.restricted_leave_type_ids"
                    control={control}
                    disabled={!hasRestrictedLeaveTypePairs || disabled}
                    error={!!restricted_leave_type_ids}
                    helperText={errorMessages(
                      restricted_leave_type_ids?.message
                    )}
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
                  />
                </Stack>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

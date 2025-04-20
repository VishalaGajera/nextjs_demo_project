import {
  Autocomplete,
  CheckBox,
  FormRow,
  PadBox,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  InputLabel,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { t } from "i18next";
import { isEmpty } from "lodash";
import type { ForwardedRef } from "react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import type { UseFormSetError, UseFormSetValue } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useEnableDisableButtonToggle } from "../../../../../hooks/useEnableDisableButtonToggle";
import { filterNestedChangedFormFields } from "../../../../../utils/helper";
import { CompanyAutocomplete } from "../../../../common/Autocomplete/CompanyAutocomplete";
import type { OvertimesRulesResponse } from "../EditOvertimeRules/Hooks/useGetOvertimeRules";
import { MemoizedAutoApprovalForm } from "./AutoApprovalForm";
import { dayTypeSchema, MemoizedDayTypeForm } from "./DayTypeForm";
import {
  ManualApprovalSchema,
  MemoizedManualApprovalForm,
} from "./ManualApprovalForm";
import { getRoundingLabel } from "./OptionLabel";
import {
  getUpdatedSubmissionAndApprovalDetails,
  prepareSubmissionAndApprovalTypeValues,
} from "./getSubmissionAndApprovalTypeValues";
import type { AddOvertimeRulesPayload } from "./hooks/useAddOvertimeRules";

type PaidOtCriteria = {
  overtime_start_minutes: number | null;
  overtime_end_minutes: number | null;
  overtime_rate_type_id?: string | null;
  overtime_rate_type_day?: number | null;
  id?: string | null;
  action?: string;
};

export type DayType = {
  is_employee_paid_overtime_enabled?: boolean;
  calculation_unit_type?: "hours" | "day";
  hours_compensation?: "all_hours" | "before_shift_start" | "after_shift_end";
  paid_overtime_criteria?: PaidOtCriteria[];
  is_overtime_min_time_enabled?: boolean | null;
  minimum_in_time_overtime_duration_minutes?: number | null;
  minimum_out_time_overtime_duration_minutes?: number | null;
};

export const submissionType = "submission_and_approval_details";

export type OtCriteriaDirtyFields = {
  calculation_unit_type?: boolean;
  hours_compensation?: boolean;
  is_overtime_min_time_enabled?: boolean;
  minimum_in_time_overtime_duration_minutes?: boolean;
  minimum_out_time_overtime_duration_minutes?: boolean;
  paid_overtime_criteria?: {
    overtime_start_minutes?: boolean;
    overtime_end_minutes?: boolean;
    overtime_rate_type_id?: boolean;
    overtime_rate_type_day?: boolean;
    id?: boolean;
    action?: boolean;
  }[];
};

type DayTypeDirtyFields = {
  working_day: OtCriteriaDirtyFields;
  weekly_off_day: OtCriteriaDirtyFields;
  holiday_day: OtCriteriaDirtyFields;
};

export type DayTypeFormFields = {
  working_day?: DayType;
  weekly_off_day?: DayType;
  holiday_day?: DayType;
};

const overtimeRulesFormSchema = z
  .object({
    is_working_day_enabled: z.boolean().optional(),
    is_weekly_off_enabled: z.boolean().optional(),
    is_holiday_enabled: z.boolean().optional(),
    company_id: z
      .string()
      .nullable()
      .refine((value) => !!value, { message: "This field is mandatory" }),
    overtime_rule_name: z
      .string()
      .nullable()
      .refine((value) => !!value, { message: "This field is mandatory" }),
    overtime_rule_code: z
      .string()
      .nullable()
      .refine((value) => !!value, { message: "This field is mandatory" }),
    working_day: dayTypeSchema.nullable().optional(),
    holiday_day: dayTypeSchema.nullable().optional(),
    weekly_off_day: dayTypeSchema.nullable().optional(),
    is_round_off: z.boolean().nullable().optional(),
    round_off_minutes: z.number().nullable().optional(),
    round_off_to: z
      .enum(["round_off_nearest", "round_up_to", "round_down_to"])
      .nullable()
      .optional(),
    submission_and_approval_type: z
      .enum([
        "manual_approval",
        "auto_calculate_approval",
        "auto_calculate_no_approval",
      ])
      .nullable()
      .optional(),
    submission_and_approval_details: z.union([
      ManualApprovalSchema.nullable().optional(),
      ManualApprovalSchema.nullable().optional(),
    ]),
  })

  // eslint-disable-next-line sonarjs/cognitive-complexity
  .superRefine((data, ctx) => {
    if (data.is_round_off) {
      if (!data.round_off_minutes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["round_off_minutes"],
          message: "Round-off interval is required when round-off is enabled.",
        });
      }

      if (!data.round_off_to) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["round_off_to"],
          message: "Round-off method is required when round-off is enabled.",
        });
      }
    }

    if (data.submission_and_approval_type === "manual_approval") {
      if (
        data.submission_and_approval_details &&
        data.submission_and_approval_details.allow_past_dated_request &&
        data.submission_and_approval_details.is_notice_period_days &&
        data.submission_and_approval_details?.maximum_past_request_days == null
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [
            "submission_and_approval_details",
            "maximum_past_request_days",
          ],
          message: "common.required",
        });
      }

      if (data.submission_and_approval_details?.notice_period_days === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["submission_and_approval_details", "notice_period_days"],
          message: "common.required",
        });
      }

      if (
        data.submission_and_approval_details?.notice_period_working_days ===
        null
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [
            "submission_and_approval_details",
            "notice_period_working_days",
          ],
          message: "common.required",
        });
      }
    }

    if (data.submission_and_approval_type !== "auto_calculate_no_approval") {
      data.submission_and_approval_details?.approval_workflow.forEach(
        (workflow, index) => {
          if (
            workflow.is_auto_approve_days_enabled &&
            workflow.auto_approve_days == null
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [
                "submission_and_approval_details",
                "approval_workflow",
                index,
                "auto_approve_days",
              ],
              message: "common.required",
            });
          }

          if (!workflow.assignments.length) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [
                "submission_and_approval_details",
                "approval_workflow",
                index,
                "assignments",
              ],
              message: "common.required",
            });
          }
        }
      );
    }
  });

type ApplicableDayType = "working_day" | "weekly_off_day" | "holiday_day";

const dayTypeOptions: ApplicableDayType[] = [
  "working_day",
  "weekly_off_day",
  "holiday_day",
];

type DayTypeMapping = {
  working_day: "is_working_day_enabled";
  weekly_off_day: "is_weekly_off_enabled";
  holiday_day: "is_holiday_enabled";
};

const dayTypeMapping: DayTypeMapping = {
  working_day: "is_working_day_enabled",
  weekly_off_day: "is_weekly_off_enabled",
  holiday_day: "is_holiday_enabled",
};

export type OvertimeRulesFormFieldValues = z.infer<
  typeof overtimeRulesFormSchema
>;

export type FormRef = {
  submitForm: (
    onSubmit: (
      formValues:
        | Partial<AddOvertimeRulesPayload>
        | Partial<OvertimeRulesFormFieldValues>
    ) => void
  ) => void;
  setError: UseFormSetError<OvertimeRulesFormFieldValues>;
  setValue: UseFormSetValue<OvertimeRulesFormFieldValues>;
};

export type DeletedApprovalWorkflow = {
  id: string;
  action: string;
};

type AddOvertimeRulesFormProps = {
  defaultValues?: OvertimesRulesResponse;
  loading?: boolean;
  disabled?: boolean;
  type?: "edit" | "create" | "view";
};

const dayDefaultValues: DayType = {
  is_employee_paid_overtime_enabled: false,
  is_overtime_min_time_enabled: false,
  calculation_unit_type: "hours",
  hours_compensation: "all_hours",
  paid_overtime_criteria: [
    {
      overtime_start_minutes: null,
      overtime_end_minutes: null,
      overtime_rate_type_id: null,
      overtime_rate_type_day: null,
      action: "add",
    },
  ],
  minimum_in_time_overtime_duration_minutes: null,
  minimum_out_time_overtime_duration_minutes: null,
};

const defaultApprovalWorkflow = [
  {
    level: 1,
    is_auto_approve_days_enabled: false,
    auto_approve_days: 0,
    assignments: [],
  },
];

const defaultSubmissionAndApprovalDetails = {
  notice_period_days: 0,
  notice_period_working_days: 0,
  is_comment_required: false,
  allow_past_dated_request: false,
  manager_can_submit: false,
  skip_approver_if_not_assigned: false,
  is_notice_period_days: false,
  approval_workflow: defaultApprovalWorkflow,
};

const formDefaultValues: OvertimeRulesFormFieldValues = {
  company_id: null,
  is_working_day_enabled: false,
  is_weekly_off_enabled: false,
  is_holiday_enabled: false,
  overtime_rule_name: null,
  overtime_rule_code: null,
  working_day: null,
  weekly_off_day: null,
  holiday_day: null,
  is_round_off: false,
  round_off_minutes: 5,
  round_off_to: "round_off_nearest",
  submission_and_approval_type: "auto_calculate_no_approval",
  submission_and_approval_details: defaultSubmissionAndApprovalDetails,
};

export const AddOvertimeRulesForm = forwardRef(
  (
    {
      defaultValues,
      loading = false,
      disabled = false,
      type = "create",
    }: AddOvertimeRulesFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const [deletedApprovalWorkflow, setDeletedApprovalWorkflow] = useState<
      DeletedApprovalWorkflow[]
    >([]);

    const theme = useTheme();

    const { butterflyBlue } = theme.palette.app.color;

    const initialValues = useMemo(() => {
      if (defaultValues) {
        const initialWorkFlow =
          defaultValues?.submission_and_approval_details?.approval_workflow;

        const values = {
          ...defaultValues,
          round_off_minutes: defaultValues.round_off_minutes ?? 5,
          round_off_to: defaultValues.round_off_to ?? "round_off_nearest",
          submission_and_approval_details: {
            ...defaultValues?.submission_and_approval_details,
            is_notice_period_days:
              !!defaultValues?.submission_and_approval_details
                ?.maximum_past_request_days,
            approval_workflow:
              initialWorkFlow?.map((workFlow) => {
                return {
                  ...workFlow,
                  assignments: workFlow.assignments?.map(
                    (assignment) => assignment.employee_id
                  ),
                };
              }) ?? defaultApprovalWorkflow,
          },
        };

        return values;
      }

      return formDefaultValues;
    }, [defaultValues]);

    const formMethods = useForm<OvertimeRulesFormFieldValues>({
      values: initialValues,
      resolver: zodResolver(overtimeRulesFormSchema),
      mode: "all",
    });

    const {
      watch,
      setError,
      setValue,
      resetField,
      clearErrors,
      formState: { errors, dirtyFields },
      handleSubmit,
      control,
    } = formMethods;

    const [deletedOTcriteriaId, setDeletedOTcriteriaId] =
      useState<DayTypeFormFields>();

    const is_working_day_enabled = watch("is_working_day_enabled");

    const is_weekly_off_enabled = watch("is_weekly_off_enabled");

    const is_holiday_enabled = watch("is_holiday_enabled");

    const working_day = watch("working_day");

    const weekly_off_day = watch("weekly_off_day");

    const holiday_day = watch("holiday_day");

    const RoundOffMinutes = watch("round_off_minutes") ?? 5;

    const renderRoundingMethodForm =
      is_working_day_enabled || is_weekly_off_enabled || is_holiday_enabled;

    const isRoundingMethod = watch("is_round_off");

    useEnableDisableButtonToggle({
      errors,
      isFormChanged:
        (!isEmpty(dirtyFields) && !!renderRoundingMethodForm) ||
        !!deletedApprovalWorkflow?.length,
    });

    const submissionAndApprovalType = watch("submission_and_approval_type");

    const getDayTypeDirtyFields = (type: "update" | "add") => {
      const dayTypeFormValues: Partial<DayTypeDirtyFields> = {};

      // eslint-disable-next-line sonarjs/no-nested-functions
      dayTypeOptions.forEach((dayType) => {
        const dayTypeDirtyFields = dirtyFields[dayType];

        if (
          type === "add" &&
          dayTypeDirtyFields &&
          typeof dayTypeDirtyFields === "object"
        ) {
          dayTypeFormValues[dayType] = {
            calculation_unit_type: true,
            hours_compensation: true,
            is_overtime_min_time_enabled: true,
            ...dayTypeDirtyFields,
            paid_overtime_criteria: (
              dayTypeDirtyFields?.paid_overtime_criteria || []
            ).map((otField) => ({
              ...otField,
              overtime_rate_type_id: !otField.overtime_rate_type_day,
              overtime_rate_type_day: !otField.overtime_rate_type_id,
              overtime_start_minutes: true,
            })),
          };
        } else if (
          type === "update" &&
          dayTypeDirtyFields &&
          typeof dayTypeDirtyFields === "object"
        ) {
          if (dirtyFields[dayType]) {
            dayTypeFormValues[dayType] = {
              ...dayTypeDirtyFields,
            };
          }

          if (
            Array.isArray(dayTypeDirtyFields?.paid_overtime_criteria) &&
            dayTypeDirtyFields.paid_overtime_criteria.length
          ) {
            dayTypeFormValues[dayType] = {
              ...dayTypeDirtyFields,
              paid_overtime_criteria: (
                dayTypeDirtyFields?.paid_overtime_criteria || []
              ).map((otField) => {
                const hasAnyTrueValue = Object.values(otField).some(
                  // eslint-disable-next-line sonarjs/no-nested-functions
                  (value) => value === true
                );

                return {
                  ...otField,
                  action: hasAnyTrueValue,
                  id: hasAnyTrueValue,
                };
              }),
            };
          }

          if (
            dirtyFields[dayType] &&
            dayTypeMapping[dayType] &&
            dirtyFields[dayTypeMapping[dayType]]
          ) {
            dayTypeFormValues[dayType] = {
              ...dayTypeFormValues[dayType],
              calculation_unit_type: true,
              hours_compensation: true,
              is_overtime_min_time_enabled: true,
            };
          }
        }
      });

      return dayTypeFormValues;
    };

    const getDayTypeFormValues = (
      formData: Partial<OvertimeRulesFormFieldValues>,
      formValues: Partial<OvertimeRulesFormFieldValues>
    ) => {
      const dayTypeFormValues: DayTypeFormFields = {};

      dayTypeOptions.forEach((dayType) => {
        const deletedDay = deletedOTcriteriaId?.[dayType];

        const deletedOTcriteria = deletedDay?.paid_overtime_criteria;

        if (formValues[dayType]) {
          const newlyAddedOtCriteria = formValues[
            dayType
          ].paid_overtime_criteria?.filter((item) => item?.action === "add");

          const paidOvertimeCriteria = [
            ...(deletedOTcriteria ? [...deletedOTcriteria] : []),
            ...(newlyAddedOtCriteria ?? []),
          ];

          dayTypeFormValues[dayType] = {
            ...formData[dayType],
            paid_overtime_criteria: paidOvertimeCriteria.length
              ? paidOvertimeCriteria
              : undefined,
          };
        }

        if (formData[dayType]) {
          const updatedOTcriteria =
            formData[dayType]?.paid_overtime_criteria
              ?.map((item) => {
                return item?.id ? { ...item, action: "update" } : { ...item };
              })
              ?.filter((item) => item.action === "update") ?? [];

          const paidOvertimeCriteria = [
            ...updatedOTcriteria,
            ...(dayTypeFormValues[dayType]?.paid_overtime_criteria || []),
          ];

          dayTypeFormValues[dayType] = {
            ...dayTypeFormValues[dayType],
            paid_overtime_criteria: paidOvertimeCriteria.length
              ? paidOvertimeCriteria
              : undefined,
          };
        }
      });

      return dayTypeFormValues;
    };

    const getSubmissionAndApprovalDirtyFields = () => {
      const submissionAndApprovalDirtyFields =
        dirtyFields.submission_and_approval_details;

      if (
        submissionAndApprovalDirtyFields &&
        typeof submissionAndApprovalDirtyFields === "object" &&
        submissionAndApprovalDirtyFields.approval_workflow
      ) {
        return {
          ...submissionAndApprovalDirtyFields,
          approval_workflow:
            submissionAndApprovalDirtyFields.approval_workflow.map((item) => {
              const hasAnyTrueValue = Object.values(item).some(
                (value) => value === true
              );

              return {
                ...item,
                id: hasAnyTrueValue,
                level: hasAnyTrueValue,
              };
            }),
        };
      } else if (
        submissionAndApprovalDirtyFields &&
        typeof submissionAndApprovalDirtyFields === "object"
      ) {
        return {
          ...submissionAndApprovalDirtyFields,
        };
      }
    };

    const getNewlyAddedWorkFlow = (
      formData: Partial<OvertimeRulesFormFieldValues>
    ) => {
      if (formData?.submission_and_approval_details?.approval_workflow) {
        const workFlows =
          formData.submission_and_approval_details.approval_workflow;

        const updatedWorkFlow = workFlows.filter((item) => !("id" in item));

        updatedWorkFlow.forEach((item) => {
          if (item.auto_approve_days === null) {
            delete item.auto_approve_days;
          }
        });

        return updatedWorkFlow;
      }
    };

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          if (type === "edit" && defaultValues) {
            const dayTypeDirtyFields = getDayTypeDirtyFields("update");

            const filterFormValues = filterNestedChangedFormFields(formValues, {
              ...dirtyFields,
              round_off_minutes: !!isRoundingMethod,
              round_off_to: !!isRoundingMethod,
              ...dayTypeDirtyFields,
              submission_and_approval_details:
                formValues.submission_and_approval_type ===
                "auto_calculate_no_approval"
                  ? false
                  : getSubmissionAndApprovalDirtyFields(),
            });

            const dayTypeFormValues = getDayTypeFormValues(
              filterFormValues,
              formValues
            );

            const newlyAddedWorkFlow = getNewlyAddedWorkFlow(formValues);

            const submissionAndApprovalTypeValues =
              getUpdatedSubmissionAndApprovalDetails(
                filterFormValues,
                defaultValues,
                deletedApprovalWorkflow,
                newlyAddedWorkFlow
              );

            delete filterFormValues.submission_and_approval_details;
            delete filterFormValues.weekly_off_day;
            delete filterFormValues.working_day;
            delete filterFormValues.holiday_day;

            onSubmit({
              ...filterFormValues,
              ...dayTypeFormValues,
              ...(filterFormValues.submission_and_approval_type !==
                "auto_calculate_no_approval" &&
                submissionAndApprovalTypeValues && {
                  ...submissionAndApprovalTypeValues,
                }),
            });

            return;
          }

          const dayTypeFormValues = getDayTypeDirtyFields("add");

          const filterFormValues = filterNestedChangedFormFields(formValues, {
            ...dirtyFields,
            is_working_day_enabled: true,
            is_weekly_off_enabled: true,
            is_holiday_enabled: true,
            is_round_off: true,
            round_off_minutes: !!isRoundingMethod,
            round_off_to: !!isRoundingMethod,
            submission_and_approval_type: true,
            ...dayTypeFormValues,
          });

          const submissionAndApprovalTypeValues =
            prepareSubmissionAndApprovalTypeValues(filterFormValues);

          const payload = {
            ...filterFormValues,
            submission_and_approval_details: submissionAndApprovalTypeValues,
          };

          onSubmit(
            filterFormValues.submission_and_approval_type !==
              "auto_calculate_no_approval" &&
              filterFormValues.submission_and_approval_details
              ? payload
              : { ...filterFormValues }
          );
        })();
      },
      setError,
      setValue,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    // eslint-disable-next-line sonarjs/cognitive-complexity
    useMemo(() => {
      if (is_working_day_enabled && !working_day) {
        setValue("working_day", dayDefaultValues);
      } else if (!is_working_day_enabled && working_day) {
        setValue("working_day", null);
        clearErrors("working_day");
      } else if (!is_working_day_enabled) {
        clearErrors("working_day");
      }

      if (is_weekly_off_enabled && !weekly_off_day) {
        setValue("weekly_off_day", dayDefaultValues);
      } else if (!is_weekly_off_enabled && weekly_off_day) {
        setValue("weekly_off_day", null);
        clearErrors("weekly_off_day");
      } else if (!is_weekly_off_enabled) {
        clearErrors("weekly_off_day");
      }

      if (is_holiday_enabled && !holiday_day) {
        setValue("holiday_day", dayDefaultValues);
      } else if (!is_holiday_enabled && holiday_day) {
        setValue("holiday_day", null);
        clearErrors("holiday_day");
      } else if (!is_holiday_enabled) {
        clearErrors("holiday_day");
      }

      if (
        !is_holiday_enabled &&
        !is_working_day_enabled &&
        !is_weekly_off_enabled
      ) {
        clearErrors("is_round_off");

        setValue("is_round_off", false);
      }
    }, [is_working_day_enabled, is_weekly_off_enabled, is_holiday_enabled]);

    useMemo(() => {
      if (!isRoundingMethod) {
        clearErrors("round_off_minutes");
        clearErrors("round_off_to");

        setValue("round_off_minutes", null);
        setValue("round_off_to", null);
      }
    }, [isRoundingMethod]);

    useEffect(() => {
      if (submissionAndApprovalType !== "manual_approval") {
        resetField(`${submissionType}.notice_period_days`, { defaultValue: 0 });
        resetField(`${submissionType}.notice_period_working_days`, {
          defaultValue: 0,
        });
        resetField(`${submissionType}.maximum_past_request_days`, {
          defaultValue: 0,
        });
        resetField(`${submissionType}.allow_past_dated_request`, {
          defaultValue: false,
        });
        resetField(`${submissionType}.is_comment_required`, {
          defaultValue: false,
        });
        resetField(`${submissionType}.manager_can_submit`, {
          defaultValue: false,
        });
      }

      clearErrors(`${submissionType}`);

      if (
        initialValues?.submission_and_approval_type !==
        submissionAndApprovalType
      ) {
        if (submissionAndApprovalType === "manual_approval") {
          setValue(
            "submission_and_approval_details",
            defaultSubmissionAndApprovalDetails,
            {
              shouldDirty: true,
            }
          );
        } else {
          setValue(
            `${submissionType}.approval_workflow`,
            defaultApprovalWorkflow,
            { shouldDirty: true }
          );
        }
      } else {
        resetField("submission_and_approval_details");
      }
    }, [submissionAndApprovalType]);

    return (
      <Stack gap="10px">
        <FormProvider {...formMethods}>
          <FormRow maxColumn={3}>
            <CompanyAutocomplete
              name="company_id"
              control={control}
              disabled={disabled || type === "edit"}
              error={!!errors.company_id}
              loading={loading}
              helperText={errorMessages(errors.company_id?.message)}
              required
            />
          </FormRow>
          <FormRow maxColumn={3}>
            <TextField
              name="overtime_rule_code"
              control={control}
              label="Overtime Rule Code"
              disabled={disabled || type === "edit"}
              loading={loading}
              error={!!errors.overtime_rule_code}
              helperText={errorMessages(errors.overtime_rule_code?.message)}
              required
            />
            <TextField
              name="overtime_rule_name"
              control={control}
              label="Overtime Rule"
              disabled={disabled}
              loading={loading}
              error={!!errors.overtime_rule_name}
              helperText={errorMessages(errors.overtime_rule_name?.message)}
              required
            />
          </FormRow>
          <PadBox padding={{ paddingY: "15px" }}>
            <Typography fontWeight={600} variant="h5">
              Overtime Setup
            </Typography>
          </PadBox>

          <Stack gap="10px">
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Overtime (OT) applies to the following days.
            </Typography>

            <Stack gap="10px">
              <Stack direction="row" gap="10px">
                <CheckBox
                  name="is_working_day_enabled"
                  control={control}
                  size="small"
                  loading={loading}
                  disabled={disabled}
                />

                <InputLabel>Working Days</InputLabel>
              </Stack>
              {is_working_day_enabled && (
                <PadBox padding={{ paddingLeft: "25px" }}>
                  <MemoizedDayTypeForm
                    dayType="working_day"
                    disabled={disabled}
                    setDeletedOTcriteriaId={setDeletedOTcriteriaId}
                    deletedOTcriteriaId={deletedOTcriteriaId}
                  />
                </PadBox>
              )}
              <Stack direction="row" gap="10px">
                <CheckBox
                  name="is_weekly_off_enabled"
                  control={control}
                  size="small"
                  disabled={disabled}
                  loading={loading}
                />

                <InputLabel>Weekly Off Days</InputLabel>
              </Stack>

              {is_weekly_off_enabled && (
                <PadBox padding={{ paddingLeft: "25px" }}>
                  <MemoizedDayTypeForm
                    dayType="weekly_off_day"
                    disabled={disabled}
                    setDeletedOTcriteriaId={setDeletedOTcriteriaId}
                    deletedOTcriteriaId={deletedOTcriteriaId}
                  />
                </PadBox>
              )}
              <Stack direction="row" gap="10px">
                <CheckBox
                  name="is_holiday_enabled"
                  control={control}
                  size="small"
                  loading={loading}
                  disabled={disabled}
                />

                <InputLabel>Holiday Days</InputLabel>
              </Stack>
              {is_holiday_enabled && (
                <PadBox padding={{ paddingLeft: "25px" }}>
                  <MemoizedDayTypeForm
                    dayType="holiday_day"
                    disabled={disabled}
                    setDeletedOTcriteriaId={setDeletedOTcriteriaId}
                    deletedOTcriteriaId={deletedOTcriteriaId}
                  />
                </PadBox>
              )}
            </Stack>

            {!renderRoundingMethodForm && type !== "view" && (
              <PadBox padding={{ paddingY: "15px" }}>
                <Alert severity="error">
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    At least one day type must be selected.
                  </Typography>
                </Alert>
              </PadBox>
            )}
          </Stack>

          <Stack gap="10px">
            {renderRoundingMethodForm && (
              <>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Should OT hours be rounded off if they are in decimals for
                  calculating overtime compensation?
                </Typography>

                <RadioGroupField
                  name="is_round_off"
                  control={control}
                  loading={loading}
                  disabled={disabled}
                  direction="column"
                  label=""
                  options={[
                    {
                      label: "No. Do not round off OT hours",
                      values: false,
                      disabled: disabled || false,
                    },
                    {
                      label: "Yes. Round off OT hours",
                      values: true,
                      disabled: disabled || false,
                    },
                  ]}
                />
              </>
            )}
            {isRoundingMethod && renderRoundingMethodForm && (
              <Stack gap="10px">
                <FormRow maxColumn={3}>
                  <Autocomplete
                    label="Interval For Round Off "
                    control={control}
                    loading={loading}
                    disabled={disabled}
                    name="round_off_minutes"
                    options={[
                      { label: "5 Minutes", value: 5 },
                      { label: "10 Minutes", value: 10 },
                      { label: "15 Minutes", value: 15 },
                    ]}
                    error={!!errors.round_off_minutes}
                    helperText={errorMessages(
                      errors.round_off_minutes?.message
                    )}
                  />
                </FormRow>
                <RadioGroupField
                  name="round_off_to"
                  control={control}
                  loading={loading}
                  disabled={disabled}
                  direction="column"
                  label=""
                  sx={{
                    alignItems: "flex-start",
                  }}
                  options={[
                    {
                      label: (
                        <Stack>
                          <Typography variant="body1">
                            Round to nearest
                          </Typography>

                          <Typography
                            variant="body2"
                            color={butterflyBlue[400]}
                          >
                            Example:
                            {getRoundingLabel(13, RoundOffMinutes, "nearest")}
                          </Typography>
                        </Stack>
                      ),
                      values: "round_off_nearest",
                      disabled: disabled || false,
                    },
                    {
                      label: (
                        <Stack>
                          <Typography variant="body1">Round down to</Typography>

                          <Typography
                            variant="body2"
                            color={butterflyBlue[400]}
                          >
                            Example:
                            {getRoundingLabel(13, RoundOffMinutes, "down")}
                          </Typography>
                        </Stack>
                      ),
                      values: "round_down_to",
                      disabled: disabled || false,
                    },
                    {
                      label: (
                        <Stack>
                          <Typography variant="body1">Round up to</Typography>

                          <Typography
                            variant="body2"
                            color={butterflyBlue[400]}
                          >
                            Example:
                            {getRoundingLabel(17, RoundOffMinutes, "up")}
                          </Typography>
                        </Stack>
                      ),
                      values: "round_up_to",
                      disabled: disabled || false,
                    },
                  ]}
                />
              </Stack>
            )}
          </Stack>

          <PadBox padding={{ paddingY: "15px" }}>
            <Typography fontWeight={600} variant="h5">
              Submission & Approval
            </Typography>
          </PadBox>
          <Stack>
            <RadioGroupField
              name="submission_and_approval_type"
              sx={{
                alignItems: "flex-start ",
              }}
              control={control}
              loading={loading}
              disabled={disabled}
              direction="column"
              label=""
              options={[
                {
                  label: (
                    <Stack gap="10px" alignItems="baseline">
                      <Typography variant="body1" paddingTop="6px">
                        Employees must notify their managers in advance if they
                        intend to work overtime. only overtime hours that have
                        received approval will be eligible for paid
                        compensation.
                      </Typography>

                      {submissionAndApprovalType === "manual_approval" && (
                        <MemoizedManualApprovalForm
                          disabled={disabled}
                          setDeletedApprovalWorkflow={
                            setDeletedApprovalWorkflow
                          }
                          deletedApprovalWorkflow={deletedApprovalWorkflow}
                        />
                      )}
                    </Stack>
                  ),
                  values: "manual_approval",
                  disabled: disabled || false,
                },
                {
                  label: (
                    <Stack gap="10px" alignItems="baseline">
                      <Typography variant="body1" paddingTop="6px">
                        Overtime will be calculated automatically and submitted
                        for approval. Only approved overtime hours will be
                        eligible for paid compensation.
                      </Typography>

                      {submissionAndApprovalType ===
                        "auto_calculate_approval" && (
                        <MemoizedAutoApprovalForm
                          disabled={disabled}
                          setDeletedApprovalWorkflow={
                            setDeletedApprovalWorkflow
                          }
                          deletedApprovalWorkflow={deletedApprovalWorkflow}
                        />
                      )}
                    </Stack>
                  ),

                  values: "auto_calculate_approval",
                  disabled: disabled || false,
                },
                {
                  label: (
                    <Box>
                      <Typography variant="body1" paddingTop="6px">
                        Overtime will be automatically calculated and paid as
                        per defined rules. No manual submission or approval is
                        required.
                      </Typography>
                    </Box>
                  ),
                  values: "auto_calculate_no_approval",
                  disabled: disabled || false,
                },
              ]}
            />
          </Stack>
        </FormProvider>
      </Stack>
    );
  }
);

AddOvertimeRulesForm.displayName = "AddOvertimeRulesForm";

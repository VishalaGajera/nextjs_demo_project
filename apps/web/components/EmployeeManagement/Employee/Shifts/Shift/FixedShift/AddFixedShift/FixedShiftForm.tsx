import {
  Card,
  CheckBox,
  FormContainer,
  FormRow,
  getTimeInHHmm,
  PadBox,
  RadioGroupField,
  TextField,
  TimeField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputLabel, Stack } from "@mui/material";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../../hooks/useEnableDisableButton";
import { getTimeDifference } from "../../../../../../../utils/date";
import { filterNestedChangedFormFields } from "../../../../../../../utils/helper";
import { esiNoRegex } from "../../../../../../../utils/regex";
import { CompanyAutocomplete } from "../../../../../../common/Autocomplete/CompanyAutocomplete";
import { CriteriaAutoComplete } from "../../../../../../common/Autocomplete/CriteriaAutoComplete";
import { DepartmentAutocomplete } from "../../../../../../common/Autocomplete/DepartmentAutocomplete";
import { FixedShiftTimingForm } from "./FixedShiftTimingForm";
import { calculateNetWorkingHours } from "./FixedShiftTimingRow";

const DaySchema = z
  .object({
    shift_start: z
      .string()
      .nullable()
      .refine((value) => !!value, { message: "common.required" })
      .refine(
        (value) => {
          if (!value) {
            return false;
          }

          return DateTime.fromISO(value).isValid;
        },
        { message: "common.invalidTime" }
      ),
    shift_end: z
      .string()
      .nullable()
      .refine((value) => !!value, { message: "common.required" })
      .refine(
        (value) => {
          if (!value) {
            return false;
          }

          return DateTime.fromISO(value).isValid;
        },
        { message: "common.invalidTime" }
      ),
    break_start: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (!value) {
            return true;
          }

          return DateTime.fromISO(value).isValid;
        },
        { message: "common.invalidTime" }
      ),
    break_end: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (!value) {
            return true;
          }

          return DateTime.fromISO(value).isValid;
        },
        { message: "common.invalidTime" }
      ),
    break_hours: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (!value) {
            return true;
          }

          return DateTime.fromISO(value).isValid;
        },
        { message: "common.invalidTime" }
      ),
    shift_hours: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (!value) {
            return true;
          }

          return DateTime.fromISO(value).isValid;
        },
        { message: "common.invalidTime" }
      ),
  })
  // eslint-disable-next-line sonarjs/cognitive-complexity
  .superRefine((data, ctx) => {
    if (data) {
      if (data.shift_start && data.shift_end && data.break_start) {
        const start = getTimeInHHmm(data.shift_start);

        const end = getTimeInHHmm(data.shift_end);

        const breakStartTime = getTimeInHHmm(data.break_start);

        if (end > start) {
          const isBreakStartInRange =
            breakStartTime > start && breakStartTime < end;

          if (!isBreakStartInRange) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["break_start"],
              message:
                "Break from time cannot be earlier than the shift from time or later than the shift to time. Please enter a valid break time.",
            });
          }
        }

        if (end < start) {
          const isBreakStartInNightRange =
            breakStartTime < start && breakStartTime > end;

          if (isBreakStartInNightRange) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["break_start"],
              message:
                "Break from time cannot be earlier than the shift from time or later than the shift to time. Please enter a valid break time.",
            });
          }
        }
      }

      if (data.shift_end && data.break_start && data.break_end) {
        const start = getTimeInHHmm(data.break_start);

        const end = getTimeInHHmm(data.shift_end);

        const breakEndTime = getTimeInHHmm(data.break_end);

        if (end > start) {
          const isBreakEndInRange = breakEndTime > start && breakEndTime < end;

          if (!isBreakEndInRange) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["break_end"],
              message:
                "Break to time must be after Break from time and before Shift To time. Please enter a valid break time.",
            });
          }
        }

        if (end < start) {
          const isBreakEndInNightRange =
            breakEndTime < start && breakEndTime > end;

          if (isBreakEndInNightRange) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["break_end"],
              message:
                "Break to time must be after Break from time and before Shift To time. Please enter a valid break time.",
            });
          }
        }
      }

      if (data.break_start && data.break_end && data.break_hours) {
        const getBreakHours = getTimeDifference({
          start: data.break_start,
          end: data.break_end,
        }).duration.toFormat("hh:mm:ss");

        const checkBreakFixableTime = getBreakHours < data.break_hours;

        if (checkBreakFixableTime) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["break_hours"],
            message:
              "Break Gross Hours must be within the Break From and Break To time.",
          });
        }
      }
    }
  });

const FixedShiftFormSchema = z
  .object({
    company_id: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    shift_type: z.string().optional(),
    shift_type_code: z
      .string()
      .regex(esiNoRegex, "common.noSpecialChar")
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    shift_type_name: z
      .string()
      .max(50, "common.maxLength.fifty")
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    description: z.string().max(250, "common.maxLength").nullable(),
    timings: z.object({
      is_varied_by_day: z.boolean(),
      is_flexible_break: z.boolean(),
      day_configuration: z.object({
        monday: DaySchema,
        tuesday: DaySchema,
        wednesday: DaySchema,
        thursday: DaySchema,
        friday: DaySchema,
        saturday: DaySchema,
        sunday: DaySchema,
      }),
    }),
    applicable_criteria: z.object({
      applies_to: z.string().nullable(),
      criteria_ids: z.array(z.string()).nullable(),
      grace_in_minutes: z
        .string()
        .nullable()
        .optional()
        .refine(
          (value) => {
            if (!value) {
              return true;
            }

            return DateTime.fromISO(value).isValid;
          },
          { message: "common.invalidTime" }
        ),

      grace_out_minutes: z
        .string()
        .nullable()
        .optional()
        .refine(
          (value) => {
            if (!value) {
              return true;
            }

            return DateTime.fromISO(value).isValid;
          },
          { message: "common.invalidTime" }
        ),

      min_half_day_hours: z
        .string()
        .nullable()
        .refine((value) => !!value, {
          message: "common.required",
        })
        .refine(
          (value) => {
            if (!value) {
              return false;
            }

            return DateTime.fromISO(value).isValid;
          },
          { message: "common.invalidTime" }
        ),
      min_full_day_hours: z
        .string()
        .nullable()
        .refine((value) => !!value, {
          message: "common.required",
        })
        .refine(
          (value) => {
            if (!value) {
              return false;
            }

            return DateTime.fromISO(value).isValid;
          },
          { message: "common.invalidTime" }
        ),
      max_working_hours_per_day: z
        .string()
        .nullable()
        .refine((value) => !!value, {
          message: "common.required",
        })
        .refine(
          (value) => {
            if (!value) {
              return false;
            }

            return DateTime.fromISO(value).isValid;
          },
          { message: "common.invalidTime" }
        ),
      hours_calculation_method: z
        .string()
        .nullable()
        .refine((value) => !!value, {
          message: "common.required",
        }),
    }),
  })
  .superRefine((val, ctx) => {
    if (
      val.applicable_criteria.applies_to &&
      !val.applicable_criteria.criteria_ids?.length
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["applicable_criteria.criteria_ids"],
      });
    }
    // eslint-disable-next-line sonarjs/cognitive-complexity
    Object.entries(val.timings.day_configuration).forEach(([days, values]) => {
      const { shift_start, shift_end, break_start, break_end, break_hours } =
        values;

      const isBreakFlexible = val.timings.is_flexible_break;

      const shiftStart = shift_start ? DateTime.fromISO(shift_start) : null;

      const shiftEnd = shift_end ? DateTime.fromISO(shift_end) : null;

      const breakStart = break_start ? DateTime.fromISO(break_start) : null;

      const breakEnd = break_end ? DateTime.fromISO(break_end) : null;

      const breakHours = break_hours ? DateTime.fromISO(break_hours) : null;

      const getWorkingHours = calculateNetWorkingHours(
        shiftStart ? shiftStart.toISO() : null,
        shiftEnd ? shiftEnd.toISO() : null,
        breakStart ? breakStart.toISO() : null,
        breakEnd ? breakEnd.toISO() : null,
        isBreakFlexible,
        breakHours ? breakHours.toISO() : null
      );

      if (getWorkingHours) {
        const match = getWorkingHours.match(/\d+/g);

        if (match) {
          const [hours, minutes] = match.map(Number);

          const getConvertedTime = DateTime.fromObject({
            hour: hours,
            minute: minutes,
          }).toFormat("HH:mm:ss");

          if (val.applicable_criteria.min_half_day_hours) {
            const minHalfDayTime = getTimeInHHmm(
              val.applicable_criteria.min_half_day_hours,
              "HH:mm:ss"
            );

            if (getConvertedTime < minHalfDayTime) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                  "Half Day hours must be less than Effective Work Hours.",
                path: ["applicable_criteria.min_half_day_hours"],
              });
            }
          }

          if (
            val.applicable_criteria.min_full_day_hours &&
            val.applicable_criteria.min_half_day_hours
          ) {
            const minHalfDayTime = getTimeInHHmm(
              val.applicable_criteria.min_half_day_hours,
              "HH:mm:ss"
            );

            const minFullDayTime = getTimeInHHmm(
              val.applicable_criteria.min_full_day_hours,
              "HH:mm:ss"
            );

            if (
              minHalfDayTime > minFullDayTime ||
              getConvertedTime < minFullDayTime
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                  "Full Day hours must be greater than half-day hours and less than or equal to effective work hours.",
                path: ["applicable_criteria.min_full_day_hours"],
              });
            }
          }

          if (val.applicable_criteria.max_working_hours_per_day) {
            const maxWorkingHours = getTimeInHHmm(
              val.applicable_criteria.max_working_hours_per_day,
              "HH:mm:ss"
            );

            if (getConvertedTime > maxWorkingHours) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                  "Maximum allowed out punch time cannot be earlier than effective work hours.",
                path: ["applicable_criteria.max_working_hours_per_day"],
              });
            }
          }
        }
      }

      if (!breakHours && breakStart && breakEnd && isBreakFlexible) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["timings", "day_configuration", days, "break_hours"],
          message: "common.required",
        });
      }
    });
  });

export type FixedShiftFormFieldValues = z.infer<typeof FixedShiftFormSchema>;
type DayValues = z.infer<typeof DaySchema>;

type ShiftFormProps = {
  defaultValues?: FixedShiftFormFieldValues;
  loading?: boolean;
  isEditing?: boolean;
  disabled?: boolean;
};

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<FixedShiftFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<FixedShiftFormFieldValues>;
};

type DayConfigurationKeys =
  `timings.day_configuration.${Lowercase<DayOfWeek>}.${keyof DayValues}`;

const dayValue: DayValues = {
  shift_start: null,
  shift_end: null,
  break_start: null,
  break_end: null,
  break_hours: null,
  shift_hours: null,
};

const formDefaultValues: FixedShiftFormFieldValues = {
  shift_type: "fixed",

  company_id: null,
  shift_type_code: null,
  shift_type_name: null,
  description: null,

  timings: {
    is_varied_by_day: false,
    is_flexible_break: false,

    day_configuration: {
      monday: dayValue,
      tuesday: dayValue,
      wednesday: dayValue,
      thursday: dayValue,
      friday: dayValue,
      saturday: dayValue,
      sunday: dayValue,
    },
  },

  applicable_criteria: {
    applies_to: null,
    criteria_ids: null,
    grace_in_minutes: null,
    grace_out_minutes: null,
    min_half_day_hours: null,
    min_full_day_hours: null,
    max_working_hours_per_day: null,
    hours_calculation_method: "first_in_last_out",
  },
};

export const FixedShiftForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      isEditing = false,
      disabled = false,
    }: ShiftFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const methods = useForm({
      values: defaultValues,
      resolver: zodResolver(FixedShiftFormSchema),
      mode: "all",
    });

    const {
      watch,
      control,
      formState: { errors, dirtyFields },
      setError,
      handleSubmit,
      setValue,
      resetField,
    } = methods;

    const selectedCriteria = watch("applicable_criteria.applies_to");

    const companyId = watch("company_id");

    const mondayValues = watch("timings.day_configuration.monday");

    const isVariedByDay = watch("timings.is_varied_by_day");

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        // eslint-disable-next-line sonarjs/cognitive-complexity
        handleSubmit((formValues) => {
          const filteredFormValues = filterNestedChangedFormFields(formValues, {
            ...dirtyFields,
            shift_type: true,
            applicable_criteria: {
              ...dirtyFields.applicable_criteria,
              hours_calculation_method: true,
            },
            timings: {
              ...dirtyFields.timings,
              day_configuration: Object.fromEntries(
                // eslint-disable-next-line sonarjs/no-nested-functions
                Object.entries(
                  dirtyFields.timings?.day_configuration || {}
                  // eslint-disable-next-line sonarjs/no-nested-functions
                ).map(([day, value]) => [
                  formValues.timings.is_varied_by_day ? day : "monday",
                  {
                    ...value,
                    shift_hours: true,
                    break_hours:
                      value.break_start && value.break_end ? true : false,
                  },
                ])
              ),
            },
          }) as FixedShiftFormFieldValues;

          const timings = filteredFormValues?.timings || {};

          const day_configuration = timings?.day_configuration || {};

          const timingsPayload = {
            is_flexible_break: formValues.timings.is_flexible_break,
            is_varied_by_day: formValues.timings.is_varied_by_day,
            ...(Object.keys(day_configuration).length > 0 && {
              day_configuration: Object.fromEntries(
                // eslint-disable-next-line sonarjs/no-nested-functions
                Object.entries(day_configuration).map(([day, value]) => [
                  day,
                  {
                    ...value,
                    shift_hours: getTimeInHHmm(
                      value.shift_hours ?? "",
                      "HH:mm:ss"
                    ),
                    ...(value.break_start?.length &&
                      value.break_end?.length && {
                        break_hours: getTimeInHHmm(
                          value.break_hours ?? "",
                          "HH:mm:ss"
                        ),
                      }),
                  },
                ])
              ),
            }),
          };

          const applicableCriteria = {
            min_half_day_hours:
              formValues.applicable_criteria.min_half_day_hours &&
              getTimeInHHmm(
                formValues.applicable_criteria.min_half_day_hours,
                "HH:mm:ss"
              ),
            min_full_day_hours:
              formValues.applicable_criteria.min_full_day_hours &&
              getTimeInHHmm(
                formValues.applicable_criteria.min_full_day_hours,
                "HH:mm:ss"
              ),
            max_working_hours_per_day:
              formValues.applicable_criteria.max_working_hours_per_day &&
              getTimeInHHmm(
                formValues.applicable_criteria.max_working_hours_per_day,
                "HH:mm:ss"
              ),
          };

          let payloadData = {
            ...filteredFormValues,
            ...(Object.keys(timingsPayload).length > 0 && {
              timings: timingsPayload,
            }),
            ...(filteredFormValues.applicable_criteria && {
              applicable_criteria: {
                ...filteredFormValues.applicable_criteria,
                ...applicableCriteria,
                ...(dirtyFields.applicable_criteria?.grace_in_minutes && {
                  grace_in_minutes:
                    formValues.applicable_criteria.grace_in_minutes &&
                    getTimeInHHmm(
                      formValues.applicable_criteria.grace_in_minutes,
                      "HH:mm:ss"
                    ),
                }),
                ...(dirtyFields.applicable_criteria?.grace_out_minutes && {
                  grace_out_minutes:
                    formValues.applicable_criteria.grace_out_minutes &&
                    getTimeInHHmm(
                      formValues.applicable_criteria.grace_out_minutes,
                      "HH:mm:ss"
                    ),
                }),
              },
            }),
          } as FixedShiftFormFieldValues;

          if (isEditing) {
            const timingsEditPayload = {
              is_flexible_break: formValues.timings.is_flexible_break,
              is_varied_by_day: formValues.timings.is_varied_by_day,
              ...(Object.keys(formValues.timings.day_configuration).length >
                0 && {
                day_configuration: Object.fromEntries(
                  Object.entries(formValues.timings.day_configuration).map(
                    // eslint-disable-next-line sonarjs/no-nested-functions
                    ([day, value]) => [
                      formValues.timings.is_varied_by_day ? day : "monday",
                      {
                        ...value,
                        shift_hours: getTimeInHHmm(
                          value.shift_hours ?? "",
                          "HH:mm:ss"
                        ),
                        ...(value.break_start &&
                          value.break_end && {
                            break_hours: value.break_hours
                              ? getTimeInHHmm(value.break_hours, "HH:mm:ss")
                              : null,
                          }),
                      },
                    ]
                  )
                ),
              }),
            };

            const editPayload = {
              ...filteredFormValues,
              timings: timingsEditPayload,
              ...(filteredFormValues.applicable_criteria && {
                applicable_criteria: {
                  ...filteredFormValues.applicable_criteria,
                  ...applicableCriteria,
                  grace_in_minutes:
                    formValues.applicable_criteria.grace_in_minutes &&
                    getTimeInHHmm(
                      formValues.applicable_criteria.grace_in_minutes,
                      "HH:mm:ss"
                    ),
                  grace_out_minutes:
                    formValues.applicable_criteria.grace_out_minutes &&
                    getTimeInHHmm(
                      formValues.applicable_criteria.grace_out_minutes,
                      "HH:mm:ss"
                    ),
                },
              }),
            } as unknown as FixedShiftFormFieldValues;

            payloadData = editPayload;
          }

          onSubmit(payloadData);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const fieldKeys: Array<keyof DayValues> = [
      "shift_start",
      "shift_end",
      "break_start",
      "break_end",
      "break_hours",
      "shift_hours",
    ];

    const syncDayValues = () => {
      const days: Array<Lowercase<DayOfWeek>> = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];

      days.forEach((day) => {
        fieldKeys.forEach((key) => {
          const path: DayConfigurationKeys = `timings.day_configuration.${day}.${key}`;

          setValue(path, mondayValues[key], {
            shouldDirty: true,
          });
        });
      });
    };

    useEffect(() => {
      if (!isVariedByDay) {
        syncDayValues();
      }
    }, [
      mondayValues.shift_start,
      mondayValues.shift_end,
      mondayValues.break_start,
      mondayValues.break_end,
      mondayValues.break_hours,
      mondayValues.shift_hours,
      isVariedByDay,
    ]);

    const {
      company_id,
      shift_type_code,
      shift_type_name,
      applicable_criteria,
    } = errors;

    useEffect(() => {
      if (!selectedCriteria) {
        resetField("applicable_criteria.criteria_ids", { defaultValue: null });
      }
    }, [selectedCriteria]);

    return (
      <FormProvider {...methods}>
        <FormContainer>
          <Card heading="Basic Detail">
            <PadBox padding={{ paddingTop: "10px" }}>
              <Stack gap="10px">
                <FormRow maxColumn={2}>
                  <CompanyAutocomplete
                    loading={loading}
                    name="company_id"
                    control={control}
                    error={!!company_id}
                    disabled={!!defaultValues.company_id || disabled}
                    helperText={errorMessages(company_id?.message)}
                    required
                  />

                  <TextField
                    loading={loading}
                    name="shift_type_code"
                    label="Shift Code"
                    required
                    control={control}
                    error={!!shift_type_code}
                    disabled={!!defaultValues.shift_type_code || disabled}
                    helperText={errorMessages(shift_type_code?.message)}
                  />

                  <TextField
                    loading={loading}
                    name="shift_type_name"
                    label="Shift Name"
                    control={control}
                    required
                    error={!!shift_type_name}
                    helperText={errorMessages(shift_type_name?.message)}
                    disabled={disabled}
                  />
                </FormRow>
                <FormRow>
                  <TextField
                    loading={loading}
                    control={control}
                    name="description"
                    label="Description"
                    disabled={disabled}
                  />
                </FormRow>
              </Stack>
            </PadBox>
          </Card>

          <Card heading="Shift Timing">
            <PadBox padding={{ padding: "10px 0px" }}>
              <FormRow>
                <Stack direction="row" gap="10px" alignItems="center">
                  <CheckBox
                    name="timings.is_varied_by_day"
                    size="small"
                    disabled={disabled}
                    control={control}
                    loading={loading}
                  />

                  <InputLabel>
                    Different Time for Different Days of the Week
                  </InputLabel>
                </Stack>

                <Stack direction="row" gap="10px">
                  <CheckBox
                    control={control}
                    name="timings.is_flexible_break"
                    size="small"
                    disabled={disabled}
                    loading={loading}
                  />

                  <InputLabel>Is Break Flexible</InputLabel>
                </Stack>
              </FormRow>
            </PadBox>

            <FixedShiftTimingForm loading={loading} disabled={disabled} />
          </Card>

          <Card heading="Applicable To">
            <PadBox padding={{ paddingTop: "10px" }}>
              <Stack gap="10px">
                <FormRow>
                  <CriteriaAutoComplete
                    disabled={!companyId || disabled}
                    name="applicable_criteria.applies_to"
                    loading={loading}
                    control={control}
                  />

                  {selectedCriteria && (
                    <DepartmentAutocomplete
                      disabled={!companyId || disabled}
                      multiple
                      name="applicable_criteria.criteria_ids"
                      companyId={companyId}
                      loading={loading}
                      error={!!applicable_criteria?.criteria_ids}
                      helperText={errorMessages(
                        applicable_criteria?.criteria_ids?.message
                      )}
                      control={control}
                    />
                  )}
                </FormRow>

                <FormRow>
                  <TimeField
                    loading={loading}
                    ampm={false}
                    name="applicable_criteria.grace_in_minutes"
                    label="Grace In(Minutes)"
                    isReturnLocalTime
                    error={!!applicable_criteria?.grace_in_minutes}
                    helperText={errorMessages(
                      applicable_criteria?.grace_in_minutes?.message
                    )}
                    disabled={disabled}
                    control={control}
                  />

                  <TimeField
                    loading={loading}
                    ampm={false}
                    name="applicable_criteria.grace_out_minutes"
                    label="Grace Out(Minutes)"
                    isReturnLocalTime
                    error={!!applicable_criteria?.grace_out_minutes}
                    helperText={errorMessages(
                      applicable_criteria?.grace_out_minutes?.message
                    )}
                    disabled={disabled}
                    control={control}
                  />
                  <TimeField
                    loading={loading}
                    ampm={false}
                    name="applicable_criteria.min_half_day_hours"
                    label="Half Day (Minimum Hours)"
                    isReturnLocalTime
                    error={!!applicable_criteria?.min_half_day_hours}
                    helperText={errorMessages(
                      applicable_criteria?.min_half_day_hours?.message
                    )}
                    disabled={disabled}
                    required
                    control={control}
                  />
                </FormRow>
                <FormRow>
                  <TimeField
                    loading={loading}
                    ampm={false}
                    name="applicable_criteria.min_full_day_hours"
                    label="Full Day (Minimum Hours)"
                    isReturnLocalTime
                    error={!!applicable_criteria?.min_full_day_hours}
                    helperText={errorMessages(
                      applicable_criteria?.min_full_day_hours?.message
                    )}
                    disabled={disabled}
                    required
                    control={control}
                  />

                  <TimeField
                    loading={loading}
                    ampm={false}
                    name="applicable_criteria.max_working_hours_per_day"
                    label="Out Punch Window(Maximum Hours)"
                    isReturnLocalTime
                    required
                    error={!!applicable_criteria?.max_working_hours_per_day}
                    helperText={errorMessages(
                      applicable_criteria?.max_working_hours_per_day?.message
                    )}
                    disabled={disabled}
                    control={control}
                  />
                </FormRow>

                <FormRow maxColumn={2}>
                  <RadioGroupField
                    loading={loading}
                    name="applicable_criteria.hours_calculation_method"
                    label="Total hours Calculation :"
                    size="medium"
                    control={control}
                    options={[
                      {
                        values: "first_in_last_out",
                        label: "First Clock-in & Last Clock-Out",
                        disabled: disabled || false,
                      },
                      {
                        values: "clock_in_clock_out",
                        label: "Every Valid Clock-In & Clock-Out",
                        disabled: disabled || false,
                      },
                    ]}
                  />
                </FormRow>
              </Stack>
            </PadBox>
          </Card>
        </FormContainer>
      </FormProvider>
    );
  }
);

FixedShiftForm.displayName = "FixedShiftForm";

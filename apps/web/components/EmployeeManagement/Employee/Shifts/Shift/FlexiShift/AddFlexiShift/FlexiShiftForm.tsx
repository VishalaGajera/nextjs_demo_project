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
import { FlexiShiftTimingForm } from "./FlexiShiftTimingForm";
import { calculateNetWorkingHours } from "./FlexiShiftTimingRow";

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
    shift_hours: z
      .string()
      .nullable()
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
  })
  // eslint-disable-next-line sonarjs/cognitive-complexity
  .superRefine((data, ctx) => {
    const shiftStart = data.shift_start;

    const shiftEnd = data.shift_end;

    const breakStart = data.break_start;

    const breakEnd = data.break_end;

    const shiftHours = data.shift_hours;

    if (shiftStart && shiftEnd && breakStart) {
      const start = DateTime.fromISO(shiftStart);

      const end = DateTime.fromISO(shiftEnd);

      const breakStartTime = DateTime.fromISO(breakStart);

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

    if (shiftEnd && breakStart && breakEnd) {
      const start = DateTime.fromISO(breakStart);

      const end = DateTime.fromISO(shiftEnd);

      const breakEndTime = DateTime.fromISO(breakEnd);

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

    if (shiftHours && shiftStart && shiftEnd) {
      const start = DateTime.fromISO(shiftStart);

      let end = DateTime.fromISO(shiftEnd);

      if (end < start) {
        end = end.plus({ days: 1 });
      }

      const totalMinutes = end.diff(start, "minutes").minutes;

      const totalSeconds = end.diff(start, "seconds").seconds;

      const hours = Math.floor(totalMinutes / 60)
        .toString()
        .padStart(2, "0");

      const minutes = (totalMinutes % 60).toString().padStart(2, "0");

      const seconds = (totalSeconds % 60).toString().padStart(2, "0");

      const formattedDiff = `${hours}:${minutes}:${seconds}`;

      const checkShiftFixableTime = formattedDiff < shiftHours;

      if (checkShiftFixableTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["shift_hours"],
          message:
            "Shift Gross Hours must be within the Shift From and Shift To time.",
        });
      }
    }
  });

const FlexiShiftFormSchema = z
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
    description: z.string().max(255, "common.maxLength").nullable(),
    timings: z
      .object({
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
      })
      .superRefine((timings, ctx) => {
        // eslint-disable-next-line sonarjs/cognitive-complexity
        Object.entries(timings.day_configuration).forEach(([days, values]) => {
          const { break_start, break_end, break_hours } = values;

          const isBreakFlexible = timings.is_flexible_break;

          if (isBreakFlexible && break_start && break_end && break_hours) {
            const getBreakHours = getTimeDifference({
              start: break_start,
              end: break_end,
            }).duration.toFormat("hh:mm");

            const checkBreakFixableTime = getBreakHours < break_hours;

            if (checkBreakFixableTime) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["day_configuration", days, "break_hours"],
                message:
                  "Break Gross Hours must be within the Break From and Break To time.",
              });
            }
          }
        });
      }),
    applicable_criteria: z.object({
      applies_to: z.string().nullable(),
      criteria_ids: z.array(z.string()).nullable(),

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
      const { shift_hours, break_start, break_end, break_hours } = values;

      const isBreakFlexible = val.timings.is_flexible_break;

      const breakStart = break_start ? DateTime.fromISO(break_start) : null;

      const breakEnd = break_end ? DateTime.fromISO(break_end) : null;

      const breakHours = break_hours ? DateTime.fromISO(break_hours) : null;

      const getWorkingHours = calculateNetWorkingHours(
        shift_hours,
        isBreakFlexible,
        breakHours ? breakHours.toISO() : null,
        breakStart ? breakStart.toISO() : null,
        breakEnd ? breakEnd.toISO() : null
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

export type FlexiShiftFormFieldValues = z.infer<typeof FlexiShiftFormSchema>;
type DayValues = z.infer<typeof DaySchema>;

type FlexiShiftFormProps = {
  defaultValues?: FlexiShiftFormFieldValues;
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
    onSubmit: (formValues: Partial<FlexiShiftFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<FlexiShiftFormFieldValues>;
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

const formDefaultValues: FlexiShiftFormFieldValues = {
  shift_type: "flexible",

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
    min_half_day_hours: null,
    min_full_day_hours: null,
    max_working_hours_per_day: null,
    hours_calculation_method: "first_in_last_out",
  },
};

export const FlexiShiftForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      isEditing = false,
      disabled = false,
    }: FlexiShiftFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const methods = useForm({
      values: defaultValues,
      resolver: zodResolver(FlexiShiftFormSchema),
      mode: "all",
    });

    const {
      watch,
      setError,
      control,
      formState: { errors, dirtyFields },
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
          }) as FlexiShiftFormFieldValues;

          const timings = filteredFormValues?.timings || {};

          const day_configuration = timings?.day_configuration || {};

          const timingsPayload = {
            is_flexible_break: formValues.timings.is_flexible_break,
            is_varied_by_day: formValues.timings.is_varied_by_day,
            ...(Object.keys(day_configuration).length > 0 && {
              day_configuration: Object.fromEntries(
                // eslint-disable-next-line sonarjs/no-nested-functions
                Object.entries(day_configuration).map(([day, value]) => [
                  formValues.timings.is_varied_by_day ? day : "monday",
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
              },
            }),
          } as FlexiShiftFormFieldValues;

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
                        ...(value.break_start?.length &&
                          value.break_end?.length && {
                            break_hours: getTimeInHHmm(
                              value.break_hours ?? "",
                              "HH:mm:ss"
                            ),
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
                },
              }),
            } as FlexiShiftFormFieldValues;

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
    } = errors ?? {};

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
                    control={control}
                    name="shift_type_code"
                    label="Shift Code"
                    required
                    error={!!shift_type_code}
                    disabled={!!defaultValues.shift_type_code || disabled}
                    helperText={errorMessages(shift_type_code?.message)}
                  />

                  <TextField
                    loading={loading}
                    control={control}
                    name="shift_type_name"
                    label="Shift Name"
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
                <Stack direction="row" gap="10px">
                  <CheckBox
                    control={control}
                    name="timings.is_varied_by_day"
                    size="small"
                    disabled={disabled}
                  />

                  <InputLabel>
                    Different Time for Different Days of the Week
                  </InputLabel>
                </Stack>

                <Stack direction="row" gap="10px">
                  <CheckBox
                    name="timings.is_flexible_break"
                    control={control}
                    size="small"
                    disabled={disabled}
                  />

                  <InputLabel>Is Break Flexible</InputLabel>
                </Stack>
              </FormRow>
            </PadBox>

            <FlexiShiftTimingForm loading={loading} disabled={disabled} />
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
                      control={control}
                      error={!!applicable_criteria?.criteria_ids}
                      helperText={errorMessages(
                        applicable_criteria?.criteria_ids?.message
                      )}
                    />
                  )}
                </FormRow>

                <FormRow>
                  <TimeField
                    loading={loading}
                    control={control}
                    ampm={false}
                    name="applicable_criteria.min_half_day_hours"
                    label="Half Day (Minimum Hours)"
                    isReturnLocalTime
                    error={!!applicable_criteria?.min_half_day_hours}
                    helperText={errorMessages(
                      applicable_criteria?.min_half_day_hours?.message
                    )}
                    required
                    disabled={disabled}
                  />

                  <TimeField
                    loading={loading}
                    control={control}
                    ampm={false}
                    name="applicable_criteria.min_full_day_hours"
                    label="Full Day (Minimum Hours)"
                    isReturnLocalTime
                    error={!!applicable_criteria?.min_full_day_hours}
                    helperText={errorMessages(
                      applicable_criteria?.min_full_day_hours?.message
                    )}
                    required
                    disabled={disabled}
                  />

                  <TimeField
                    loading={loading}
                    control={control}
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
                  />
                </FormRow>

                <FormRow maxColumn={2}>
                  <RadioGroupField
                    control={control}
                    loading={loading}
                    name="applicable_criteria.hours_calculation_method"
                    label="Total hours Calculation :"
                    size="medium"
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

FlexiShiftForm.displayName = "FlexiShiftForm";

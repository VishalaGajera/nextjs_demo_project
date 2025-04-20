/* eslint-disable sonarjs/no-nested-functions */
/* eslint-disable no-lonely-if */
import {
  Card,
  FormContainer,
  getTimeInHHmm,
  PadBox,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import _, { isNull, omitBy } from "lodash";
import { DateTime } from "luxon";
import {
  type ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { FormProvider, useForm, type UseFormSetError } from "react-hook-form";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../../hooks/useEnableDisableButton";
import { getTimeHhMmSs } from "../../../../../../../utils/date";
import { filterNestedChangedFormFields } from "../../../../../../../utils/helper";
import {
  BasicDetailFrom,
  basicDetailSchema,
} from "../../ShiftForm/BasicDetailFrom";
import {
  calculateNetWorkingShiftHours,
  handleTwentyFourHoursTime,
  modifyTimeInDateTime,
} from "../hooks/helper";
import {
  applicableCriteriaSchema,
  AutoApplicableFrom,
} from "./AutoApplicableFrom";
import {
  AutoShiftAssignmentForm,
  autoShiftAssignmentSchema,
} from "./AutoShiftAssignmentForm";
import { AutoShiftDefaultTimingForm } from "./AutoShiftDefaultTimingForm";
import { defaultShiftTimingsSchema } from "./AutoShiftDefaultTimingRow";

// TODO: Kinjal: First Clock In Window 24 hours validation pending
const AutoShiftFormSchema = z
  .object({
    shift_type: z.string().optional(),

    auto_shift_timings: z.array(autoShiftAssignmentSchema),

    default_shift_timing: defaultShiftTimingsSchema,

    applicable_criteria: applicableCriteriaSchema,
  })
  .and(basicDetailSchema)
  // eslint-disable-next-line sonarjs/cognitive-complexity
  .superRefine((data, ctx) => {
    if (data) {
      const autoShiftTimings = data.auto_shift_timings;

      const defaultShiftTiming = data.default_shift_timing;

      if (autoShiftTimings) {
        // eslint-disable-next-line sonarjs/cognitive-complexity
        autoShiftTimings.forEach((value, index) => {
          const clockStartInHhMm =
            (value.clock_in_start && getTimeInHHmm(value.clock_in_start)) ?? "";

          const clockEndInHhMm =
            (value.clock_in_end && getTimeInHHmm(value.clock_in_end)) ?? "";

          const shiftInHhMm =
            (value.shift_start && getTimeInHHmm(value.shift_start)) ?? "";

          const shiftToHhMm =
            (value.shift_end && getTimeInHHmm(value.shift_end)) ?? "";

          const breakInHhMm =
            (value.break_start && getTimeInHHmm(value.break_start)) ?? "";

          const breakToHhMm =
            (value.break_end && getTimeInHHmm(value.break_end)) ?? "";

          const slotToHhMm =
            (value.slot_end && getTimeInHHmm(value.slot_end)) ?? "";

          const isDayShift = clockStartInHhMm < clockEndInHhMm;

          if (isDayShift) {
            if (
              (shiftInHhMm && clockStartInHhMm > shiftInHhMm) ||
              (shiftInHhMm > clockEndInHhMm && shiftInHhMm)
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["auto_shift_timings", index, "shift_start"],
                message:
                  "Shift start time must fall within the Clock-in window.",
              });
            }
          } else {
            // eslint-disable-next-line sonarjs/no-lonely-if
            if (
              clockStartInHhMm > shiftInHhMm &&
              shiftInHhMm > clockEndInHhMm
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["auto_shift_timings", index, "shift_start"],
                message:
                  "Shift start time must fall within the Clock-in window.",
              });
            }
          }

          // break start
          if (shiftInHhMm < shiftToHhMm) {
            if (
              (breakInHhMm && shiftInHhMm > breakInHhMm) ||
              (breakInHhMm > shiftToHhMm && breakInHhMm)
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["auto_shift_timings", index, "break_start"],
                message:
                  "Break start time must fall within the Shift-time-in window.",
              });
            }
          } else {
            // eslint-disable-next-line sonarjs/no-lonely-if
            if (shiftInHhMm > breakInHhMm && breakInHhMm > shiftToHhMm) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["auto_shift_timings", index, "break_start"],
                message:
                  "Break start time must fall within the Shift-time-in window.",
              });
            }
          }

          // break end
          if (shiftInHhMm < shiftToHhMm) {
            if (shiftToHhMm && breakInHhMm && breakToHhMm) {
              const isBreakEndInRange =
                breakToHhMm > breakInHhMm && breakToHhMm < shiftToHhMm;

              if (!isBreakEndInRange) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: ["auto_shift_timings", index, "break_end"],
                  message:
                    "Break to time must be after 'Break From' and before 'Shift To' time",
                });
              }
            }
          } else if (shiftToHhMm && breakInHhMm && breakToHhMm) {
            const isBreakEndInRange =
              breakToHhMm < breakInHhMm && breakToHhMm > shiftToHhMm;

            if (isBreakEndInRange) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["auto_shift_timings", index, "break_end"],
                message:
                  "Break to time must be after 'Break From' and before 'Shift To' time",
              });
            }
          }

          if (clockStartInHhMm < shiftToHhMm) {
            if (clockStartInHhMm && slotToHhMm && shiftToHhMm) {
              const isShiftRange =
                slotToHhMm >= clockStartInHhMm && slotToHhMm <= shiftToHhMm;

              if (isShiftRange) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: ["auto_shift_timings", index, "slot_end"],
                  message: "Slot to time is overlapping with shift timings.",
                });
              }
            }
          } else if (clockStartInHhMm && slotToHhMm && shiftToHhMm) {
            const isShiftRange =
              slotToHhMm < clockStartInHhMm && slotToHhMm > shiftToHhMm;

            if (!isShiftRange) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["auto_shift_timings", index, "slot_end"],
                message:
                  "Break to time must be after 'Break From' and before 'Shift To' time",
              });
            }
          }

          const currentDate = DateTime.now().toFormat("yyyy-MM-dd");

          const covertTimeToDateTime = modifyTimeInDateTime(
            autoShiftTimings,
            currentDate
          );

          const isFirstClockTimeIn24Hours =
            handleTwentyFourHoursTime(covertTimeToDateTime);

          if (index > 0) {
            const previousValue = autoShiftTimings[index - 1];

            const previousClockInEndInHhMm =
              previousValue?.clock_in_end &&
              getTimeInHHmm(previousValue?.clock_in_end);

            const clockStartInHhMm =
              value.clock_in_start && getTimeInHHmm(value.clock_in_start);

            const shiftInHhMm =
              value.shift_start && getTimeInHHmm(value.shift_start);

            const shiftEndInHhMm =
              value.shift_end && getTimeInHHmm(value.shift_end);

            if (
              shiftInHhMm &&
              shiftEndInHhMm &&
              previousClockInEndInHhMm &&
              clockStartInHhMm &&
              previousClockInEndInHhMm >= clockStartInHhMm
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["auto_shift_timings", index, "clock_in_start"],
                message: "From time must be later than the previous 'To' time",
              });
            }

            if (isFirstClockTimeIn24Hours && clockStartInHhMm) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: [
                  "auto_shift_timings",
                  autoShiftTimings.length - 1,
                  "clock_in_start",
                ],
                message: "First Clock Time should be in 24 hours",
              });
            }

            if (isFirstClockTimeIn24Hours && clockEndInHhMm) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: [
                  "auto_shift_timings",
                  autoShiftTimings.length - 1,
                  "clock_in_end",
                ],
                message: "First Clock Time should be in 24 hours",
              });
            }
          }
        });
      }

      if (defaultShiftTiming) {
        const shiftStart = defaultShiftTiming.shift_start ?? "";

        const shiftEnd = defaultShiftTiming.shift_end ?? "";

        const breakStart = defaultShiftTiming.break_start ?? "";

        const breakEnd = defaultShiftTiming.break_end ?? "";

        const shiftHours = getTimeHhMmSs({
          start: shiftStart,
          end: shiftEnd,
        });

        const breakHours = getTimeHhMmSs({
          start: breakStart,
          end: breakEnd,
        });

        const getWorkingHours = calculateNetWorkingShiftHours(
          shiftHours,
          breakHours
        );

        if (getWorkingHours) {
          if (data.applicable_criteria.min_half_day_hours) {
            const minHalfDayTime = DateTime.fromISO(
              data.applicable_criteria.min_half_day_hours
            ).toFormat("hh:mm:ss");

            if (getWorkingHours < minHalfDayTime) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                  "Half Day hours must be less than Effective Work Hours.",
                path: ["applicable_criteria.min_half_day_hours"],
              });
            }
          }

          if (
            data.applicable_criteria.min_full_day_hours &&
            data.applicable_criteria.min_half_day_hours
          ) {
            const minHalfDayTime = DateTime.fromISO(
              data.applicable_criteria.min_half_day_hours
            ).toFormat("hh:mm:ss");

            const minFullDayTime = DateTime.fromISO(
              data.applicable_criteria.min_full_day_hours
            ).toFormat("hh:mm:ss");

            if (
              minHalfDayTime > minFullDayTime ||
              getWorkingHours < minFullDayTime
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                  "Full Day hours must be greater than half-day hours and less than or equal to effective work hours.",
                path: ["applicable_criteria.min_full_day_hours"],
              });
            }
          }
        }
      }
    }
  });

export type AutoShiftFormFieldValues = z.infer<typeof AutoShiftFormSchema>;

export type ShiftFormProps = {
  defaultValues?: AutoShiftFormFieldValues;
  loading?: boolean;
  disabled?: boolean;
  isEdit?: boolean;
};

export type AutoShiftTypes = Partial<{
  id: string;
  action: string;
  auto_shift_type_name: string | null;
  shift_start: string | null;
  shift_end: string | null;
  shift_hours: string | null;
  break_start: string | null;
  break_end: string | null;
  break_hours: string | null;
  clock_in_start: string | null;
  clock_in_end: string | null;
  slot_start: string | null;
  slot_end: string | null;
}>;

const defaultShiftTiming = {
  shift_start: null,
  shift_end: null,
  shift_hours: null,
  break_start: null,
  break_end: null,
  break_hours: null,
};

const formDefaultValues: AutoShiftFormFieldValues = {
  shift_type: "auto",
  company_id: null,
  shift_type_code: null,
  shift_type_name: null,
  description: null,

  auto_shift_timings: [
    {
      ...defaultShiftTiming,
      auto_shift_type_name: null,
      clock_in_start: null,
      clock_in_end: null,
      slot_start: null,
      slot_end: null,
    },
  ],

  default_shift_timing: { ...defaultShiftTiming },

  applicable_criteria: {
    grace_in_minutes: null,
    grace_out_minutes: null,
    min_half_day_hours: null,
    min_full_day_hours: null,
    hours_calculation_method: "first_in_last_out",
  },
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<AutoShiftFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<AutoShiftFormFieldValues>;
};

export const AutoShiftForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
      isEdit = false,
    }: ShiftFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const methods = useForm<AutoShiftFormFieldValues>({
      values: defaultValues,
      resolver: zodResolver(AutoShiftFormSchema),
      mode: "all",
    });

    const {
      control,
      formState: { errors, dirtyFields },
      setError,
      handleSubmit,
    } = methods;

    const [deletedAutoShiftTimingsId, setDeletedAutoShiftTimingsId] =
      useState<AutoShiftTypes[]>();

    useEnableDisableButton({ control, defaultValues, errors });

    const getAutoShiftTimingsDirtyFields = () => {
      const autoShiftTimingsDirtyFields = Array.isArray(
        dirtyFields.auto_shift_timings
      )
        ? dirtyFields.auto_shift_timings.map((timings) => {
            const hasAnyTrueValue = Object.values(timings).some(
              // eslint-disable-next-line sonarjs/no-nested-functions
              (value) => value === true
            );

            return {
              id: hasAnyTrueValue,
              action: hasAnyTrueValue,
              auto_shift_type_name: hasAnyTrueValue,
              shift_start: hasAnyTrueValue,
              shift_end: hasAnyTrueValue,
              shift_hours: hasAnyTrueValue,
              break_start: hasAnyTrueValue,
              break_end: hasAnyTrueValue,
              break_hours: hasAnyTrueValue,
              clock_in_start: hasAnyTrueValue,
              clock_in_end: hasAnyTrueValue,
              slot_start: hasAnyTrueValue,
              slot_end: hasAnyTrueValue,
            };
          })
        : [];

      return autoShiftTimingsDirtyFields;
    };

    const getUpdatedAutoShiftTimings = (
      filterFormValues: Partial<AutoShiftFormFieldValues>,
      formValues: Partial<AutoShiftFormFieldValues>
    ) => {
      const addedAutoShiftTimings = formValues?.auto_shift_timings?.filter(
        (timings) => {
          return timings.action === "add";
        }
      );

      const newlyAddedAutoShiftTimings = addedAutoShiftTimings?.map((obj) =>
        omitBy(obj, isNull)
      );

      const newlyUpdateAutoShiftTimings = filterFormValues?.auto_shift_timings
        ?.map((timings) => {
          return timings?.id
            ? { ...timings, action: "update" }
            : { ...timings };
        })
        .filter((timings) => {
          return timings.action === "update";
        });

      const updateAutoShiftTimings = [
        ...(newlyUpdateAutoShiftTimings ?? []),
        ...(newlyAddedAutoShiftTimings ?? []),
        ...(deletedAutoShiftTimingsId ?? []),
      ];

      return updateAutoShiftTimings;
    };

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        // eslint-disable-next-line sonarjs/cognitive-complexity
        handleSubmit((formValues) => {
          const filteredFormValues = filterNestedChangedFormFields(formValues, {
            ...dirtyFields,
            shift_type: true,
            auto_shift_timings: dirtyFields?.auto_shift_timings?.map(
              (field) => {
                return {
                  ...field,
                  shift_hours: true,
                  break_hours: field.break_start && field.break_end,
                  slot_start: true,
                  slot_end: true,
                };
              }
            ),
            applicable_criteria: {
              ...dirtyFields.applicable_criteria,
              hours_calculation_method: true,
            },
            default_shift_timing: {
              ...dirtyFields.default_shift_timing,
              shift_hours: true,
              break_start: dirtyFields.default_shift_timing?.break_start
                ? true
                : false,
              break_end: dirtyFields.default_shift_timing?.break_end
                ? true
                : false,
              break_hours:
                dirtyFields.default_shift_timing?.break_start &&
                dirtyFields.default_shift_timing?.break_end
                  ? true
                  : false,
            },
          });

          const {
            grace_out_minutes,
            grace_in_minutes,
            min_half_day_hours,
            min_full_day_hours,
          } = formValues.applicable_criteria;

          const applicableCriteria = {
            ...(grace_out_minutes && {
              grace_out_minutes: getTimeInHHmm(grace_out_minutes, "HH:mm:ss"),
            }),
            ...(grace_in_minutes && {
              grace_in_minutes: getTimeInHHmm(grace_in_minutes, "HH:mm:ss"),
            }),
            ...(min_half_day_hours && {
              min_half_day_hours: getTimeInHHmm(min_half_day_hours, "HH:mm:ss"),
            }),
            ...(min_full_day_hours && {
              min_full_day_hours: getTimeInHHmm(min_full_day_hours, "HH:mm:ss"),
            }),
            hours_calculation_method:
              formValues.applicable_criteria.hours_calculation_method,
          };

          if (isEdit) {
            const autoShiftTimingsDirtyFields =
              getAutoShiftTimingsDirtyFields();

            const isDefaultShiftTimingUpdated =
              Object.keys(dirtyFields?.default_shift_timing || {}).length > 0;

            const filterFormValues = filterNestedChangedFormFields(formValues, {
              ...dirtyFields,

              auto_shift_timings: autoShiftTimingsDirtyFields,
              ...(isDefaultShiftTimingUpdated && {
                default_shift_timing: {
                  shift_start: true,
                  shift_end: true,
                  shift_hours: true,
                  break_start: true,
                  break_end: true,
                  break_hours: true,
                },
              }),
            });

            const updatedAutoShiftTimings = getUpdatedAutoShiftTimings(
              filterFormValues,
              formValues
            );

            const modifiedApplicableCriteriaObj = Object.fromEntries(
              Object.entries(filterFormValues?.applicable_criteria ?? {}).map(
                ([key, value]) => [
                  key,
                  key === "hours_calculation_method"
                    ? value
                    : // eslint-disable-next-line sonarjs/no-nested-conditional
                      value
                      ? getTimeInHHmm(value, "HH:mm:ss")
                      : null,
                ]
              )
            ) as AutoShiftFormFieldValues["applicable_criteria"];

            onSubmit({
              ...filterFormValues,
              shift_type: "auto",
              auto_shift_timings: updatedAutoShiftTimings.length
                ? updatedAutoShiftTimings
                : undefined,
              ...(!_.isEmpty(modifiedApplicableCriteriaObj) && {
                applicable_criteria: modifiedApplicableCriteriaObj,
              }),
            });

            return;
          }

          const payloadData = {
            ...filteredFormValues,
            applicable_criteria: applicableCriteria,
          } as AutoShiftFormFieldValues;

          onSubmit(payloadData);
        })();
      },
      setError,
    }));

    return (
      <FormProvider {...methods}>
        <FormContainer>
          <Card heading="Basic Detail">
            <PadBox padding={{ paddingTop: "10px" }}>
              <BasicDetailFrom
                loading={loading}
                disabled={disabled}
                isEdit={isEdit}
              />
            </PadBox>
          </Card>

          <Card heading="Auto Shift Assignment Shift Timings">
            <PadBox padding={{ padding: "10px 0px" }}>
              <AutoShiftAssignmentForm
                loading={loading}
                disabled={disabled}
                setDeletedAutoShiftTimingsId={setDeletedAutoShiftTimingsId}
                deletedAutoShiftTimingsId={deletedAutoShiftTimingsId}
                isEdit={isEdit}
              />
            </PadBox>
          </Card>

          <Card heading="Default Shift Timings">
            <PadBox padding={{ padding: "15px" }}>
              <AutoShiftDefaultTimingForm
                loading={loading}
                disabled={disabled}
              />
            </PadBox>
          </Card>

          <Card heading="Applicable To">
            <PadBox padding={{ paddingTop: "10px" }}>
              <AutoApplicableFrom loading={loading} disabled={disabled} />
            </PadBox>
          </Card>
        </FormContainer>
      </FormProvider>
    );
  }
);

AutoShiftForm.displayName = "AutoShiftForm";

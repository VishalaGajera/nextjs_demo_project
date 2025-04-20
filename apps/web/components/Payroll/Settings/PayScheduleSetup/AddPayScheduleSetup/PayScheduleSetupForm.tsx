import { zodResolver } from "@hookform/resolvers/zod";

import {
  EditAction,
  FormRow,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import {
  IconButton,
  Skeleton as MuiSkeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { t } from "i18next";
import { isEmpty } from "lodash";
import { DateTime } from "luxon";
import { useSearchParams } from "next/navigation";
import {
  type ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { FormProvider, useForm, type UseFormSetError } from "react-hook-form";
import { z } from "zod";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import { useEnableDisableButtonToggle } from "../../../../../hooks/useEnableDisableButtonToggle";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { filterNestedChangedFormFields } from "../../../../../utils/helper";
import { CompanyAutocomplete } from "../../../../common/Autocomplete/CompanyAutocomplete";
import { CustomDayAutoComplete } from "../../../../common/Autocomplete/CustomDayAutocomplete";
import { DurationAutocomplete } from "../../../../common/Autocomplete/DurationAutocomplete";
import {
  FormulaBuilderDialog,
  type FormulaBuilderRef,
} from "./Dialogs/FormulaBuilderDialog";
import { MonthlyVariationSection } from "./MonthlyVariationSection";

const monthConfiguration = {
  pay_day: null,
  target_hours: null,
  grace_hours: null,
};

export const monthlyVariationConfig = Object.fromEntries(
  Array.from({ length: 12 }, (_, index) => [
    index + 1,
    { ...monthConfiguration },
  ])
);

const monthlyVariationSchema = z.object({
  pay_day: z.union([z.number().nullable(), z.string().nullable()]),
  target_hours: z
    .union([
      z
        .number()
        .max(1000, {
          message: t("common.invalidMaxLimit", { maxLimit: 1000 }),
        })
        .nullable(),
      z.string().nullable(),
    ])
    .optional(),
  grace_hours: z
    .union([
      z
        .number()
        .max(1000, {
          message: t("common.invalidMaxLimit", { maxLimit: 1000 }),
        })
        .nullable(),
      z.string().nullable(),
    ])
    .optional(),
});

const createMonthlyVariationSchema = (month: number) =>
  monthlyVariationSchema.extend({
    pay_day: z
      .union([
        z.number().refine(
          (day) => {
            const daysInMonth =
              month === 2
                ? 29
                : DateTime.local(DateTime.now().year, month).daysInMonth;

            return day >= 1 && day <= (daysInMonth ?? 0);
          },
          { message: "common.invalidNumber" }
        ),
        z.string(),
      ])
      .nullable(),
  });

const monthlyVariationsSchema = z
  .object(
    Object.fromEntries(
      Array.from({ length: 12 }, (_, i) => [
        i + 1,
        createMonthlyVariationSchema(i + 1),
      ])
    )
  )
  .partial()
  .optional();

const PayScheduleSetupFormSchema = z
  .object({
    company_id: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    pay_schedule_group_name: z
      .string()
      .max(255, "common.maxLength")
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    frequency: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    end_day_of_month: z
      .number()
      .max(31, {
        message: t("common.invalidMaxLimit", { maxLimit: 31 }),
      })
      .int()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    salary_days_calculation_type: z
      .enum([
        "fixed_days",
        "total_days",
        "total_days_exclude_weekly_off",
        "total_days_exclude_holidays",
        "total_days_exclude_weekly_off_and_holidays",
        "custom_days",
      ])
      .nullable(),
    fix_days_in_month: z
      .union([
        z
          .number()
          .max(31, {
            message: t("common.invalidMaxLimit", { maxLimit: 31 }),
          })
          .nullable(),
        z.string().nullable(),
      ])
      .optional(),
    target_hours: z
      .union([
        z
          .number()
          .max(1000, {
            message: t("common.invalidMaxLimit", { maxLimit: 1000 }),
          })
          .nullable(),
        z.string().nullable(),
      ])
      .optional(),
    grace_hours: z
      .union([
        z
          .number()
          .max(1000, {
            message: t("common.invalidMaxLimit", { maxLimit: 1000 }),
          })
          .nullable(),
        z.string().nullable(),
      ])
      .optional(),
    monthly_variations: monthlyVariationsSchema,
    formula: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
  })
  .superRefine((data, ctx) => {
    if (data.salary_days_calculation_type !== "custom_days") {
      if (!data.target_hours) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["target_hours"],
          message: "common.required",
        });
      }

      if (
        data.salary_days_calculation_type === "fixed_days" &&
        !data.fix_days_in_month
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fix_days_in_month"],
          message: "common.required",
        });
      }
    } else if (data.salary_days_calculation_type === "custom_days") {
      if (!data.monthly_variations) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["monthly_variations"],
          message: "common.required",
        });
      }

      Object.entries(data.monthly_variations || {}).forEach(
        ([month, values]) => {
          if (values && !values.pay_day) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [`monthly_variations.${month}`, "pay_day"],
              message: "common.required",
            });
          }

          if (values && !values.target_hours) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [`monthly_variations.${month}`, "target_hours"],
              message: "common.required",
            });
          }
        }
      );
    }
  });

export type PayScheduleSetupFormFieldValues = z.infer<
  typeof PayScheduleSetupFormSchema
>;

export type MonthlyVariationValues = z.infer<typeof monthlyVariationSchema>;

type PayScheduleSetupFormProps = {
  defaultValues?: PayScheduleSetupFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<PayScheduleSetupFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<PayScheduleSetupFormFieldValues>;
};

const formDefaultValues: PayScheduleSetupFormFieldValues = {
  company_id: null,
  pay_schedule_group_name: null,
  frequency: "monthly",
  end_day_of_month: -1,
  salary_days_calculation_type: "fixed_days",
  fix_days_in_month: null,
  target_hours: null,
  grace_hours: null,
  monthly_variations: monthlyVariationConfig,
  formula: null,
};

const workDayTypes = [
  "present",
  "absent",
  "weekly_off",
  "holiday",
  "weekly_off_present",
  "holiday_preset",
];

const paySchedulePayDayStatusTypes = ["WOP", "HOP", "WO", "HO", "P", "A"];

export const PayScheduleSetupForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: PayScheduleSetupFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const theme = useTheme();

    const formulaBuilderDialogRef = useRef<FormulaBuilderRef>(null);

    const { slate, iron } = theme.palette.app.color;

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const methods = useForm({
      values: defaultValues,
      resolver: zodResolver(PayScheduleSetupFormSchema),
      mode: "all",
    });

    const searchParams = useSearchParams();

    const mode = searchParams.get("page");

    const isViewMode = mode === "view-pay-schedule-setup";

    const {
      watch,
      setValue,
      setError,
      clearErrors,
      control,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = methods;

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const formula = watch("formula");

    const salaryDaysCalculationConfig = watch("salary_days_calculation_type");

    const fixDaysInMonth = watch("fix_days_in_month");

    const monthlyVariations = watch("monthly_variations");

    const graceHours = watch("grace_hours");

    const targetHours = watch("target_hours");

    useMemo(() => {
      if (
        (salaryDaysCalculationConfig === "custom_days" &&
          (graceHours ?? targetHours)) ||
        errors.grace_hours ||
        errors.target_hours
      ) {
        clearErrors("grace_hours");
        clearErrors("target_hours");
        setValue("grace_hours", "");
        setValue("target_hours", "");
      } else if (
        (salaryDaysCalculationConfig !== "custom_days" &&
          monthlyVariations &&
          !!Object.keys(monthlyVariations).length) ||
        errors.monthly_variations
      ) {
        clearErrors("monthly_variations");
        setValue(
          "monthly_variations",
          {},
          {
            shouldDirty: true,
          }
        );
      }

      if (
        salaryDaysCalculationConfig !== "fixed_days" &&
        (fixDaysInMonth ?? errors.fix_days_in_month)
      ) {
        clearErrors("fix_days_in_month");
        setValue("fix_days_in_month", "");
      }
    }, [salaryDaysCalculationConfig, fixDaysInMonth, monthlyVariations]);

    useEnableDisableButtonToggle({
      errors,
      isFormChanged: !isEmpty(dirtyFields),
    });

    const handleCreateFormula = () => {
      if (formulaBuilderDialogRef.current) {
        const formValues = formulaBuilderDialogRef.current.getValues();

        setValue("formula", formValues.formula, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
      onDialogClose();
    };

    const dialogRenderer: DialogRenderer = {
      formulaBuilderDialog: (
        <FormulaBuilderDialog
          ref={formulaBuilderDialogRef}
          open
          defaultValues={{ formula }}
          placeHolders={workDayTypes}
          placeHoldersShortTypes={paySchedulePayDayStatusTypes}
          onClose={onDialogClose}
          loading={loading}
          onCreateFormula={handleCreateFormula}
        />
      ),
    };

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterNestedChangedFormFields(formValues, {
            ...dirtyFields,
            salary_days_calculation_type: true,
            frequency: formValues.frequency ? true : dirtyFields.frequency,
            end_day_of_month: formValues.end_day_of_month
              ? true
              : dirtyFields.end_day_of_month,
            fix_days_in_month:
              formValues.salary_days_calculation_type !== "fixed_days"
                ? false
                : dirtyFields.fix_days_in_month,
            grace_hours:
              formValues.salary_days_calculation_type === "custom_days"
                ? false
                : dirtyFields.grace_hours,
            target_hours:
              formValues.salary_days_calculation_type !== "custom_days"
                ? dirtyFields.target_hours
                : false,
          });

          const filterMonthlyVariationsValues =
            formValues.monthly_variations &&
            dirtyFields.monthly_variations &&
            filterNestedChangedFormFields(
              formValues.monthly_variations,
              dirtyFields.monthly_variations
            );

          const filteredFormValues = {
            ...filterFormValues,
            monthly_variations: filterMonthlyVariationsValues,
          };

          const payload = {
            ...filteredFormValues,
            ...(filteredFormValues.salary_days_calculation_type ===
              "custom_days" &&
              filteredFormValues.monthly_variations && {
                monthly_variations: {
                  ...filteredFormValues.monthly_variations,
                },
              }),
          };

          if (
            payload.monthly_variations &&
            !Object.keys(payload.monthly_variations).length
          ) {
            delete payload.monthly_variations;
          }

          onSubmit(payload);
        })();
      },
      setError,
    }));

    return (
      <Stack gap="24px" padding="15px">
        <FormProvider {...methods}>
          <FormRow>
            <CompanyAutocomplete
              control={control}
              loading={loading}
              error={!!errors.company_id}
              helperText={errorMessages(errors.company_id?.message)}
              disabled={!!defaultValues.company_id || isViewMode}
              name="company_id"
              required
            />

            <TextField
              label="Pay Schedule Name"
              control={control}
              name="pay_schedule_group_name"
              loading={loading}
              required
              error={!!errors.pay_schedule_group_name}
              helperText={errorMessages(
                errors.pay_schedule_group_name?.message
              )}
              disabled={!!defaultValues.pay_schedule_group_name || isViewMode}
            />
          </FormRow>

          <Stack gap="15px">
            <Typography variant="body1" fontWeight={500}>
              Pay Schedule Configuration
            </Typography>

            <Stack gap="10px" paddingLeft="10px">
              <Stack direction="row" alignItems="center" gap="10px">
                <Typography color={slate[900]}>Pay Frequency</Typography>

                {!loading ? (
                  <DurationAutocomplete
                    name="frequency"
                    hideLabel
                    control={control}
                    required
                    loading={loading}
                    error={!!errors.frequency}
                    helperText={errorMessages(errors.frequency?.message)}
                    sx={{ minWidth: "170px" }}
                    disabled
                  />
                ) : (
                  <MuiSkeleton
                    height="40px"
                    sx={{
                      width: "100%",
                      maxWidth: "170px",
                      transform: "scale(1)",
                    }}
                  />
                )}
              </Stack>

              <Stack direction="row" alignItems="center" gap="10px">
                <Typography color={slate[900]}>
                  Select the month&apos;s pay schedule end date.
                </Typography>

                {!loading ? (
                  <CustomDayAutoComplete
                    name="end_day_of_month"
                    loading={loading}
                    control={control}
                    error={!!errors.end_day_of_month}
                    helperText={errorMessages(errors.end_day_of_month?.message)}
                    sx={{ minWidth: "215px" }}
                    disabled={!!defaultValues.end_day_of_month || isViewMode}
                  />
                ) : (
                  <MuiSkeleton
                    height="40px"
                    sx={{
                      minWidth: "215px",
                      transform: "scale(1)",
                    }}
                  />
                )}
              </Stack>
            </Stack>
          </Stack>

          <Stack gap="15px">
            <Typography variant="body1" fontWeight={500}>
              Salary Days Calculation Config
            </Typography>

            <Stack gap="10px" paddingLeft="10px" color={slate[900]}>
              <RadioGroupField
                name="salary_days_calculation_type"
                loading={loading}
                direction="column"
                control={control}
                options={[
                  {
                    label: (
                      <Stack gap="10px" alignItems="baseline" direction="row">
                        <TextField
                          control={control}
                          sx={{ maxWidth: "250px" }}
                          type="number"
                          name="fix_days_in_month"
                          placeholder="00"
                          loading={loading}
                          error={!!errors.fix_days_in_month}
                          helperText={errorMessages(
                            errors.fix_days_in_month?.message
                          )}
                          disabled={isViewMode}
                        />

                        <Typography variant="body1">
                          Fix Days For every month
                        </Typography>
                      </Stack>
                    ),
                    values: "fixed_days",
                    disabled: isViewMode,
                  },
                  {
                    label: "Month Total Days",
                    values: "total_days",
                    disabled: isViewMode,
                  },
                  {
                    label: "Month Total Days - Weekly Off",
                    values: "total_days_exclude_weekly_off",
                    disabled: isViewMode,
                  },
                  {
                    label: "Month Total Days - Holiday",
                    values: "total_days_exclude_holidays",
                    disabled: isViewMode,
                  },
                  {
                    label: "Month Total Days - (Weekly Off + Holiday)",
                    values: "total_days_exclude_weekly_off_and_holidays",
                    disabled: isViewMode,
                  },
                  {
                    label: "Monthwise Custom Days",
                    values: "custom_days",
                    disabled: isViewMode,
                  },
                ]}
              />

              {salaryDaysCalculationConfig != "custom_days" ? (
                <Stack direction="row" gap="10px">
                  {!loading ? (
                    <TextField
                      label="Target Hours In Month"
                      type="number"
                      name="target_hours"
                      control={control}
                      placeholder="Hours"
                      loading={loading}
                      disabled={isViewMode}
                      required={!!salaryDaysCalculationConfig}
                      error={!!errors.target_hours}
                      helperText={errorMessages(errors.target_hours?.message)}
                      sx={{ width: "100%", maxWidth: "300px" }}
                    />
                  ) : (
                    <MuiSkeleton
                      height="40px"
                      sx={{
                        width: "100%",
                        maxWidth: "170px",
                        transform: "scale(1)",
                      }}
                    />
                  )}

                  {!loading ? (
                    <TextField
                      label="Grace Hours In Month"
                      type="number"
                      name="grace_hours"
                      placeholder="Hours"
                      control={control}
                      loading={loading}
                      error={!!errors.grace_hours}
                      helperText={errorMessages(errors.grace_hours?.message)}
                      sx={{ width: "100%", maxWidth: "300px" }}
                      disabled={isViewMode}
                    />
                  ) : (
                    <MuiSkeleton
                      height="40px"
                      sx={{
                        width: "100%",
                        maxWidth: "170px",
                        transform: "scale(1)",
                      }}
                    />
                  )}
                </Stack>
              ) : (
                <MonthlyVariationSection loading={loading} />
              )}
            </Stack>
          </Stack>

          <Stack gap="15px">
            <Typography variant="body1" fontWeight={500}>
              Payable Days Calculation Config
            </Typography>

            <Stack
              direction="row"
              paddingLeft="10px"
              alignItems="baseline"
              gap="10px"
            >
              <Typography color={slate[900]}>
                Formula For Payable Days
              </Typography>

              {!loading ? (
                <Stack direction="row" alignItems="flex-start" gap="5px">
                  <TextField
                    name="formula"
                    placeholder="Formula"
                    loading={loading}
                    required
                    control={control}
                    disabled
                    error={!!errors.formula}
                    helperText={errorMessages(errors.formula?.message)}
                    sx={{ minWidth: "300px" }}
                  />
                  <IconButton
                    sx={{
                      border: `1px solid ${iron[800]}`,
                      padding: "0px",
                      borderRadius: "5px",
                    }}
                    disabled={isViewMode}
                    onClick={() => onDialogOpen("formulaBuilderDialog")}
                  >
                    <EditAction />
                  </IconButton>
                </Stack>
              ) : (
                <MuiSkeleton
                  height="40px"
                  sx={{
                    minWidth: "300px",
                    transform: "scale(1)",
                  }}
                />
              )}
            </Stack>
          </Stack>

          {openedDialog && dialogRenderer[openedDialog]}
        </FormProvider>
      </Stack>
    );
  }
);

PayScheduleSetupForm.displayName = "PayScheduleSetupForm";

"use client";

import { FormRow, PadBox, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack, Typography } from "@mui/material";
import { isNil, mapValues } from "lodash";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../hooks/useEnableDisableButton";
import { filterNestedChangedFormFields } from "../../../../utils/helper";
import { CompanyAutocomplete } from "../../../common/Autocomplete/CompanyAutocomplete";
import { WeeklyOffRow } from "./WeeklyOffRow";

export const daysOfWeek = {
  sunday: false,
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
};

const weekConfiguration = {
  first: null,
  second: null,
  third: null,
  fourth: null,
  fifth: null,
  last: null,
};

const configurationList = {
  sunday: weekConfiguration,
  monday: weekConfiguration,
  tuesday: weekConfiguration,
  wednesday: weekConfiguration,
  thursday: weekConfiguration,
  friday: weekConfiguration,
  saturday: weekConfiguration,
};

export type DaysOfWeekKeys = keyof typeof daysOfWeek;

export type DaysOfWeek = typeof daysOfWeek;

export type WeekConfigurationKeys = keyof typeof weekConfiguration;

export type ConfigurationList = typeof configurationList;

export const weekNumbers = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "last",
] as const;

export const displayWeek = [
  "Weekly off Day",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "Last",
];

const DayConfigsSchema = z
  .enum(["full_day", "first_half", "second_half"])
  .optional()
  .nullable();

const configurationDays = z.object({
  first: DayConfigsSchema,
  second: DayConfigsSchema,
  third: DayConfigsSchema,
  fourth: DayConfigsSchema,
  fifth: DayConfigsSchema,
  last: DayConfigsSchema,
});

const WeeklyOffsFormSchema = z
  .object({
    company_id: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    weekly_off_type_name: z
      .string()
      .max(255, "common.maxLength")
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    description: z.string().max(255, "common.maxLength").nullable(),
    days: z.object({
      sunday: z.boolean(),
      monday: z.boolean(),
      tuesday: z.boolean(),
      wednesday: z.boolean(),
      thursday: z.boolean(),
      friday: z.boolean(),
      saturday: z.boolean(),
    }),
    configuration: z.object({
      sunday: configurationDays,
      monday: configurationDays,
      tuesday: configurationDays,
      wednesday: configurationDays,
      thursday: configurationDays,
      friday: configurationDays,
      saturday: configurationDays,
    }),
  })
  .superRefine((val, ctx) => {
    if (Object.values(val.days).some((value) => value === true)) {
      for (const [day, isEnabled] of Object.entries(val.days)) {
        if (isEnabled) {
          const config = val.configuration[day as DaysOfWeekKeys];

          const allNull = Object.values(config).every(
            (value) => value === null
          );

          if (allNull) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                "Please select at least one day for the weekly off configuration.",
              path: ["configuration", day],
            });
          }
        }
      }
    }
  });

export type WeeklyOffsFormFieldValues = z.infer<typeof WeeklyOffsFormSchema>;

type WeeklyOffsFormFormProps = {
  defaultValues?: WeeklyOffsFormFieldValues;
  loading?: boolean;
  disabled?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<WeeklyOffsFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<WeeklyOffsFormFieldValues>;
};

const formDefaultValues: WeeklyOffsFormFieldValues = {
  company_id: null,
  weekly_off_type_name: null,
  description: null,
  days: daysOfWeek,
  configuration: configurationList,
};

export const WeeklyOffsForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
    }: WeeklyOffsFormFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const {
      watch,
      setError,
      setValue,
      handleSubmit,
      control,
      formState: { errors, dirtyFields },
      clearErrors,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(WeeklyOffsFormSchema),
      mode: "onChange",
    });

    const days = watch("days");

    useEnableDisableButton({ control, defaultValues, errors });

    // TODO:Bhavik remove this after backend isue ifx
    const transformConfiguration = (
      configuration: Partial<WeeklyOffsFormFieldValues["configuration"]>
    ) => {
      const result = mapValues(configuration, (value) => {
        if (!value) {
          return null;
        }

        const allSixKeysAreNil = weekNumbers.every(
          (key) => key in value && isNil(value?.[key])
        );

        if (allSixKeysAreNil) {
          return null;
        }

        return value;
      });

      return result;
    };

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterNestedChangedFormFields(
            formValues,
            dirtyFields
          );

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { days, ...filteredWithoutDays } = filterFormValues;

          // TODO:Bhavik need to fix this type
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const updatedConfiguration: any =
            Object.keys(filteredWithoutDays).length > 0
              ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                transformConfiguration(filteredWithoutDays.configuration as any)
              : filteredWithoutDays;

          onSubmit({
            ...filteredWithoutDays,
            configuration: updatedConfiguration,
          });
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    return (
      <Stack gap="50Px">
        <FormRow maxColumn={3}>
          <CompanyAutocomplete
            required
            name="company_id"
            control={control}
            loading={loading}
            disabled={!!defaultValues.company_id || disabled}
            error={!!errors.company_id}
            helperText={errorMessages(errors.company_id?.message)}
          />

          <TextField
            required
            control={control}
            label="Weekly Off Name"
            name="weekly_off_type_name"
            error={!!errors.weekly_off_type_name}
            loading={loading}
            helperText={errorMessages(errors.weekly_off_type_name?.message)}
            disabled={disabled}
          />

          <TextField
            name="description"
            control={control}
            label="Description"
            loading={loading}
            error={!!errors.description}
            helperText={errorMessages(errors.description?.message)}
            disabled={disabled}
          />
        </FormRow>

        <Stack gap="15px">
          <Typography variant="h6">Weekly Off Configuration</Typography>

          <PadBox padding={{ padding: "20px" }}>
            <Stack gap="20px">
              <Stack
                justifyContent="space-between"
                direction="row"
                sx={{ width: "100%" }}
              >
                {displayWeek.map((week) => {
                  return (
                    <Box key={uuidv4()} sx={{ width: "200px" }}>
                      <Typography fontWeight="bold" variant="body1">
                        {week}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>

              {(Object.keys(days) as [DaysOfWeekKeys]).map((day) => {
                return (
                  <WeeklyOffRow
                    setValue={setValue}
                    watch={watch}
                    control={control}
                    defaultValues={defaultValues}
                    loading={loading}
                    key={day}
                    day={day}
                    errors={errors}
                    clearErrors={clearErrors}
                    disabled={disabled}
                  />
                );
              })}
            </Stack>
            <Typography variant="body1" color="error">
              {errors.days?.root?.message &&
                errorMessages(errors.days.root.message)}
            </Typography>
          </PadBox>
        </Stack>
      </Stack>
    );
  }
);

WeeklyOffsForm.displayName = "WeeklyOffsForm";

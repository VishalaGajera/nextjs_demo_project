import { CheckBox } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import {
  type Control,
  type FieldErrors,
  type UseFormClearErrors,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { WeeklyOffAutocomplete } from "../../../common/Autocomplete/WeeklyOffAutocomplete";
import type {
  DaysOfWeekKeys,
  WeekConfigurationKeys,
  WeeklyOffsFormFieldValues,
} from "./WeeklyOffsForm";
import { weekNumbers } from "./WeeklyOffsForm";

type weeklyOffRowProps = {
  day: DaysOfWeekKeys;
  control: Control<WeeklyOffsFormFieldValues>;
  watch: UseFormWatch<WeeklyOffsFormFieldValues>;
  errors?: FieldErrors<WeeklyOffsFormFieldValues>;
  clearErrors: UseFormClearErrors<WeeklyOffsFormFieldValues>;
  setValue: UseFormSetValue<WeeklyOffsFormFieldValues>;
  defaultValues: WeeklyOffsFormFieldValues;
  loading: boolean;
  disabled?: boolean;
};
export const WeeklyOffRow = ({
  defaultValues,
  day,
  control,
  setValue,
  watch,
  errors,
  clearErrors,
  loading,
  disabled = false,
}: weeklyOffRowProps) => {
  const { t } = useTranslation();

  const daysValue = watch("days");

  const configurationValue = watch("configuration");

  const isShiftRefresh = !Object.values(configurationValue[day] || {})?.every(
    (item) => !item
  );

  useEffect(() => {
    if (!daysValue[day]) {
      weekNumbers.forEach((week) => {
        setValue(`configuration.${day}.${week}`, null, {
          shouldDirty: true,
        });
      });
    }

    if (isShiftRefresh) {
      for (const [day, isEnabled] of Object.entries(daysValue)) {
        if (isEnabled) {
          const config = configurationValue[day as DaysOfWeekKeys];

          const allNull = Object.values(config).every(
            (value) => value === null
          );

          if (!allNull) {
            const errorPath = `configuration.${day}.root`;

            clearErrors(errorPath as keyof WeeklyOffsFormFieldValues);
          }
        }
      }
    }
  }, [isShiftRefresh]);

  return (
    <Stack gap="60px" direction="row" sx={{ width: "100%" }}>
      <Stack
        flexDirection="row"
        alignItems="center"
        gap="5px"
        sx={{ width: "100%", maxWidth: "135px" }}
      >
        <CheckBox
          disabled={!!defaultValues.days[day] || disabled}
          loading={loading}
          name={`days.${day}`}
          control={control}
        />

        <Typography fontWeight="bold" textTransform="capitalize">
          {day}
        </Typography>
      </Stack>

      <Stack
        justifyContent="space-between"
        flexDirection="row"
        alignItems="center"
        gap="5px"
        sx={{ width: "100%" }}
      >
        {weekNumbers.map((week: WeekConfigurationKeys) => {
          const configError = errors?.configuration?.[day]?.root;

          return (
            <Box key={uuidv4()} sx={{ maxWidth: "200px", width: "100%" }}>
              <WeeklyOffAutocomplete
                loading={loading}
                disabled={!daysValue[day] || disabled}
                name={`configuration.${day}.${week}`}
                control={control}
                fullWidth
                error={!!configError}
                helperText={configError?.message && t(configError.message)}
              />
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
};

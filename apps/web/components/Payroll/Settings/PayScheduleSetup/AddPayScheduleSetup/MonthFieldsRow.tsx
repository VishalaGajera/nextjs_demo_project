import { TextField } from "@codezee/sixtify-brahma";
import { Grid, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  monthlyVariationConfig,
  type PayScheduleSetupFormFieldValues,
} from "./PayScheduleSetupForm";

type MonthFieldsRowProps = {
  month: string;
  loading?: boolean;
  monthName: string;
};

export const MonthFieldsRow = ({
  month,
  loading = false,
  monthName,
}: MonthFieldsRowProps) => {
  const { t } = useTranslation();

  const {
    watch,
    setValue,
    control,
    clearErrors,
    formState: { errors },
  } = useFormContext<PayScheduleSetupFormFieldValues>();

  const searchParams = useSearchParams();

  const mode = searchParams.get("page");

  const isViewMode = mode === "view-pay-schedule-setup";

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const salaryDaysCalculationType = watch("salary_days_calculation_type");

  useMemo(() => {
    if (salaryDaysCalculationType !== "custom_days") {
      clearErrors("monthly_variations");
      setValue("monthly_variations", monthlyVariationConfig, {
        shouldDirty: true,
      });
    }
  }, [salaryDaysCalculationType]);

  return (
    <Grid
      container
      spacing={2}
      sx={{
        width: "100%",
        maxWidth: "900px",
      }}
    >
      <Grid gap="5px" item xs={3}>
        <Typography
          variant="subtitle2"
          textTransform="capitalize"
          fontWeight={600}
          sx={{ width: "100%", maxWidth: "250px" }}
        >
          {monthName}
        </Typography>
      </Grid>

      <Grid gap="5px" item xs={3}>
        <TextField
          type="number"
          name={`monthly_variations.${month}.pay_day`}
          placeholder="00"
          loading={loading}
          required
          disabled={isViewMode}
          error={!!errors.monthly_variations?.[month]?.pay_day}
          helperText={errorMessages(
            errors.monthly_variations?.[month]?.pay_day?.message
          )}
          control={control}
        />
      </Grid>

      <Grid gap="5px" item xs={3}>
        <TextField
          type="number"
          name={`monthly_variations.${month}.target_hours`}
          placeholder="00"
          loading={loading}
          required
          disabled={isViewMode}
          error={!!errors.monthly_variations?.[month]?.target_hours}
          helperText={errorMessages(
            errors.monthly_variations?.[month]?.target_hours?.message
          )}
          control={control}
        />
      </Grid>

      <Grid gap="5px" item xs={3}>
        <TextField
          type="number"
          name={`monthly_variations.${month}.grace_hours`}
          placeholder="00"
          loading={loading}
          required
          disabled={isViewMode}
          error={!!errors.monthly_variations?.[month]?.grace_hours}
          helperText={errorMessages(
            errors.monthly_variations?.[month]?.grace_hours?.message
          )}
          control={control}
        />
      </Grid>
    </Grid>
  );
};

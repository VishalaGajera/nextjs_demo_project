import { FormRow, RadioGroupField, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { type ForwardedRef, forwardRef, useImperativeHandle } from "react";
import { useForm, type UseFormSetError } from "react-hook-form";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../../hooks/useEnableDisableButton";
import { validateMaxDigit } from "../../../../../../../utils/helper";
import { CompanyAutocomplete } from "../../../../../../common/Autocomplete/CompanyAutocomplete";

export const GratuityFormSchema = z
  .object({
    company_id: z
      .string()
      .trim()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    min_tenure_year: z
      .number()
      .int({
        message: "common.invalidNumber",
      })
      .gt(0, {
        message: t("common.invalidMinLimit", {
          minLimit: "1 year",
        }),
      })
      .lte(20, {
        message: t("common.invalidMaxLimit", {
          maxLimit: "20 year",
        }),
      })
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    tenure_round_off_type: z.enum([
      "round_up",
      "round_down",
      "round_to_nearest",
      "none",
    ]),
    number_of_days_in_year: z
      .number()
      .int({
        message: "common.invalidNumber",
      })
      .gt(0, { message: "common.invalidNumber" })
      .lte(366, {
        message: t("common.invalidMaxLimit", {
          maxLimit: "366 days",
        }),
      })
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    avg_monthly_working_day: z
      .number()
      .int({
        message: "common.invalidNumber",
      })
      .gt(0, {
        message: t("common.invalidMinLimit", {
          minLimit: "1 day",
        }),
      })
      .lte(31, {
        message: t("common.invalidMaxLimit", {
          maxLimit: "31 days",
        }),
      })
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    max_gratuity_amount: z
      .number()
      .gt(0, { message: "common.positiveNumber" })
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
  })
  .superRefine((values, ctx) => {
    validateMaxDigit(ctx, "max_gratuity_amount", values.max_gratuity_amount);
  });

export type GratuityFormType = z.infer<typeof GratuityFormSchema>;

export type GratuityFormRefProps = {
  submitForm: (
    onSubmit: (formValues: Partial<GratuityFormType>) => void
  ) => void;
  setError: UseFormSetError<GratuityFormType>;
};

const errorMessages = (messageKey?: string) => {
  return messageKey && t(messageKey);
};

const GratuityFormDefaultvalue: GratuityFormType = {
  avg_monthly_working_day: null,
  company_id: null,
  max_gratuity_amount: null,
  min_tenure_year: null,
  number_of_days_in_year: null,
  tenure_round_off_type: "none",
};

type FormType = "add" | "update" | "view";

type GratuityFormProps = {
  defaultValues?: GratuityFormType;
  loading?: boolean;
  type?: FormType;
};

export const GratuityForm = forwardRef(
  (
    {
      defaultValues = GratuityFormDefaultvalue,
      loading = false,
      type = "add",
    }: GratuityFormProps,
    ref: ForwardedRef<GratuityFormRefProps>
  ) => {
    const {
      control,
      handleSubmit,
      setError,
      formState: { errors },
    } = useForm<GratuityFormType>({
      values: defaultValues,
      resolver: zodResolver(GratuityFormSchema),
      mode: "all",
    });

    useEnableDisableButton<GratuityFormType>({
      control,
      defaultValues,
      errors,
    });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          onSubmit(formValues);
        })();
      },
      setError,
    }));

    const isUpdate = type === "view" || type === "update";

    const isView = type === "view";

    return (
      <Stack gap={2}>
        <FormRow maxColumn={1}>
          <CompanyAutocomplete
            control={control}
            name="company_id"
            loading={loading}
            disabled={isUpdate}
            error={!!errors.company_id?.message}
            helperText={errorMessages(errors.company_id?.message)}
          />
        </FormRow>

        <FormRow fullWidth>
          <Stack direction="row" alignItems="baseline" gap={1}>
            <Typography variant="body1">
              The minimum tenure required to be eligible for gratuity is
            </Typography>

            <TextField
              sx={{ maxWidth: "215px" }}
              type="number"
              placeholder="00"
              name="min_tenure_year"
              control={control}
              loading={loading}
              disabled={isView}
              error={!!errors.min_tenure_year?.message}
              helperText={errorMessages(errors.min_tenure_year?.message)}
            />

            <Typography variant="body1">years</Typography>
          </Stack>
        </FormRow>

        <FormRow>
          <RadioGroupField
            name="tenure_round_off_type"
            control={control}
            direction="row"
            loading={loading}
            label="Rounding of tenure:"
            sx={{
              alignItems: "center",
            }}
            options={[
              {
                label: "None",
                values: "none",
                disabled: isView,
              },
              {
                label: "Round Up",
                values: "round_up",
                disabled: isView,
              },
              {
                label: "Round Down",
                values: "round_down",
                disabled: isView,
              },
              {
                label: "Round to Nearest",
                values: "round_to_nearest",
                disabled: isView,
              },
            ]}
          />
        </FormRow>

        <FormRow fullWidth>
          <Stack direction="row" alignItems="baseline" gap={1}>
            <Typography variant="body1">
              The number of days in a year for gratuity calculation is
            </Typography>

            <TextField
              sx={{ maxWidth: "215px" }}
              type="number"
              disabled={isView}
              loading={loading}
              placeholder="00"
              error={!!errors.number_of_days_in_year?.message}
              helperText={errorMessages(errors.number_of_days_in_year?.message)}
              name="number_of_days_in_year"
              control={control}
            />

            <Typography variant="body1">days</Typography>
          </Stack>
        </FormRow>

        <FormRow fullWidth>
          <Stack direction="row" alignItems="baseline" gap={1}>
            <Typography variant="body1">
              The average monthly working days for gratuity calculation is
            </Typography>

            <TextField
              sx={{ maxWidth: "215px" }}
              type="number"
              disabled={isView}
              placeholder="00"
              loading={loading}
              error={!!errors.avg_monthly_working_day?.message}
              helperText={errorMessages(
                errors.avg_monthly_working_day?.message
              )}
              name="avg_monthly_working_day"
              control={control}
            />

            <Typography variant="body1">days</Typography>
          </Stack>
        </FormRow>

        <FormRow fullWidth>
          <Stack direction="row" alignItems="baseline" gap={1}>
            <Typography variant="body1">
              The maximum gratuity amount is
            </Typography>

            <TextField
              sx={{ maxWidth: "215px" }}
              type="number"
              placeholder="00"
              loading={loading}
              disabled={isView}
              error={!!errors.max_gratuity_amount?.message}
              helperText={errorMessages(errors.max_gratuity_amount?.message)}
              name="max_gratuity_amount"
              control={control}
            />
          </Stack>
        </FormRow>
      </Stack>
    );
  }
);

GratuityForm.displayName = "GratuityForm";

import { CheckBox, FormRow, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputLabel, Stack, Typography } from "@mui/material";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../../hooks/useEnableDisableButton";
import {
  filterChangedFormFields,
  validateMaxDigit,
} from "../../../../../../../utils/helper";
import { holidayNameRegex } from "../../../../../../../utils/regex";
import { DurationAutocomplete } from "../../../../../../common/Autocomplete/DurationAutocomplete";

const ESICFormSchema = z
  .object({
    esic_group_name: z
      .string()
      .regex(holidayNameRegex, "common.noSpecialChar")
      .max(50, "common.maxLength.fifty")
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    deduction_cycle_type: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    employee_contribution_rate: z
      .number()
      .min(0)
      .max(100)
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    employer_contribution_rate: z
      .number()
      .min(0)
      .max(100)
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    max_eligible_monthly_salary: z
      .number()
      .min(0)
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    is_employee_override_rate: z.boolean(),
  })
  .superRefine((values, ctx) => {
    validateMaxDigit(
      ctx,
      "max_eligible_monthly_salary",
      values.max_eligible_monthly_salary
    );
  });

export type ESICFormFieldValues = z.infer<typeof ESICFormSchema>;

type ESICFormProps = {
  defaultValues?: ESICFormFieldValues;
  loading?: boolean;
  dialogType?: "add" | "edit" | "view";
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<ESICFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<ESICFormFieldValues>;
};

const formDefaultValues: ESICFormFieldValues = {
  esic_group_name: null,
  deduction_cycle_type: "monthly",
  employee_contribution_rate: null,
  employer_contribution_rate: null,
  max_eligible_monthly_salary: null,
  is_employee_override_rate: false,
};

export const ESICForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      dialogType = "add",
    }: ESICFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const isEdit = dialogType === "edit";

    const isView = dialogType === "view";

    const {
      control,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(ESICFormSchema),
      mode: "all",
    });

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(formValues, {
            ...dirtyFields,
            is_employee_override_rate: isEdit
              ? dirtyFields.is_employee_override_rate
              : true,
            deduction_cycle_type: isEdit
              ? dirtyFields.deduction_cycle_type
              : true,
          });

          onSubmit(filterFormValues);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    return (
      <Stack gap="35px">
        <FormRow maxColumn={2}>
          <TextField
            name="esic_group_name"
            control={control}
            label="ESIC Group Name"
            required
            error={!!errors.esic_group_name}
            helperText={errorMessages(errors.esic_group_name?.message)}
            loading={loading}
            disabled={isView}
          />

          <DurationAutocomplete
            control={control}
            required
            loading={loading}
            label="Deduction Cycle"
            error={!!errors.deduction_cycle_type}
            helperText={errorMessages(errors.deduction_cycle_type?.message)}
            name="deduction_cycle_type"
            disabled
          />
        </FormRow>

        <Stack gap="25px">
          <Typography variant="h6">
            Employee&apos;s Contribution Rate
          </Typography>

          <Stack gap="10px" direction="row" alignItems="baseline">
            <InputLabel>Employee&apos;s Contribution is</InputLabel>

            <TextField
              sx={{ maxWidth: "250px" }}
              type="number"
              name="employee_contribution_rate"
              placeholder="00"
              control={control}
              label=""
              loading={loading}
              error={!!errors.employee_contribution_rate}
              helperText={errorMessages(
                errors.employee_contribution_rate?.message
              )}
              disabled={isEdit || isView}
            />

            <InputLabel>% of Gross Salary</InputLabel>
          </Stack>
        </Stack>
        <Stack gap="25px">
          <Typography variant="h6">
            Employer&apos;s Contribution Rate
          </Typography>

          <Stack gap="10px" direction="row" alignItems="baseline">
            <InputLabel>Employer&apos;s Contribution is</InputLabel>

            <TextField
              sx={{ maxWidth: "250px" }}
              type="number"
              name="employer_contribution_rate"
              placeholder="00"
              control={control}
              label=""
              loading={loading}
              error={!!errors.employer_contribution_rate}
              helperText={errorMessages(
                errors.employer_contribution_rate?.message
              )}
              disabled={isEdit || isView}
            />

            <InputLabel>% of Gross Salary</InputLabel>
          </Stack>
        </Stack>

        <Stack gap="20px">
          <Stack gap="10px" direction="row" alignItems="baseline">
            <InputLabel>
              Maximum monthly gross salary applicable for ESIC eligibility
            </InputLabel>

            <TextField
              sx={{ maxWidth: "250px" }}
              type="number"
              name="max_eligible_monthly_salary"
              placeholder="00"
              control={control}
              label=""
              loading={loading}
              error={!!errors.max_eligible_monthly_salary}
              helperText={errorMessages(
                errors.max_eligible_monthly_salary?.message
              )}
              disabled={isView}
            />
          </Stack>

          <Stack alignItems="start" flexDirection="row" gap="10px">
            <CheckBox
              name="is_employee_override_rate"
              control={control}
              loading={loading}
              disabled={isView}
            />

            <Typography variant="body1">
              Override ESIC contribution rate at employee level
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    );
  }
);

ESICForm.displayName = "ESICForm";

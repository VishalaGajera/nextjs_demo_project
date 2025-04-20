import {
  CheckBox,
  DatePicker,
  FormRow,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputLabel, Stack } from "@mui/material";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../hooks/useEnableDisableButton";
import { BankShiftSchemaAutocomplete } from "../../../../common/Autocomplete/BankShiftSchemaAutocomplete";
import { BankWeeklyOffAutocomplete } from "../../../../common/Autocomplete/BankWeeklyOffAutocomplete";

const BankShiftAllocationFormSchema = z
  .object({
    bank_shift_type_id: z
      .string()
      .nullable()
      .refine((value) => !!value, { message: "common.required" }),
    weekly_off: z.string().nullable(),
    effective_from: z
      .string()
      .nullable()
      .refine((value) => !!value, { message: "common.required" }),
    effective_to: z.string().nullable(),
    has_no_end_date: z.boolean().optional().nullable(),
    remark: z.string().nullable(),
  })
  .superRefine((value, ctx) => {
    if (!value.has_no_end_date && !value.effective_to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["effective_to"],
        message: "common.required",
      });
    }
  });

export type BankShiftAllocationFormValues = z.infer<
  typeof BankShiftAllocationFormSchema
> & { employee_id: string[]; current_date: string };

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<BankShiftAllocationFormValues>) => void
  ) => void;
  setError: UseFormSetError<BankShiftAllocationFormValues>;
};

type BankShiftAllocationFormProps = {
  defaultValues?: BankShiftAllocationFormValues;
  loading?: boolean;
  employeeIds?: string[];
  companyId: string;
};

const formDefaultValues: BankShiftAllocationFormValues = {
  employee_id: [],
  bank_shift_type_id: null,
  weekly_off: null,
  effective_from: null,
  effective_to: null,
  has_no_end_date: false,
  remark: null,
  current_date: DateTime.now().toISODate(),
};

export const BankShiftAllocationForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      companyId,
    }: BankShiftAllocationFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const {
      watch,
      control,
      setError,
      clearErrors,
      setValue,
      formState: { errors },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(BankShiftAllocationFormSchema),
      mode: "all",
    });

    useEnableDisableButton({ control, defaultValues, errors });

    const HasNOEndDate = watch("has_no_end_date");

    const EffectiveTo = watch("effective_to");

    const EffectiveFrom = watch("effective_from");

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          onSubmit(formValues);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    useEffect(() => {
      if (HasNOEndDate) {
        clearErrors("effective_to");
        setValue("effective_to", null, {
          shouldDirty: true,
        });
      }
    }, [HasNOEndDate]);

    return (
      <Stack gap="20px">
        <BankShiftSchemaAutocomplete
          control={control}
          loading={loading}
          companyId={companyId}
          error={!!errors.bank_shift_type_id}
          helperText={errorMessages(errors.bank_shift_type_id?.message)}
          name="bank_shift_type_id"
          required
          fullWidth
        />

        <BankWeeklyOffAutocomplete
          name="weekly_off"
          loading={loading}
          control={control}
          error={!!errors.weekly_off}
          helperText={errorMessages(errors.weekly_off?.message)}
        />

        <FormRow maxColumn={2}>
          <DatePicker
            name="effective_from"
            control={control}
            loading={loading}
            label="Effective From"
            setError={setError}
            maxDate={
              EffectiveTo
                ? DateTime.min(
                    DateTime.fromISO(EffectiveTo),
                    DateTime.now().plus({ months: 3 })
                  )
                : DateTime.now().plus({ months: 3 })
            }
            required
            error={!!errors.effective_from}
            helperText={errorMessages(errors.effective_from?.message)}
          />

          <DatePicker
            name="effective_to"
            control={control}
            loading={loading}
            disabled={!!HasNOEndDate}
            label="Effective Up To"
            setError={setError}
            minDate={
              EffectiveFrom ? DateTime.fromISO(EffectiveFrom) : undefined
            }
            maxDate={DateTime.now().plus({ months: 3 })}
            required={HasNOEndDate ? false : true}
            error={!!errors.effective_to}
            helperText={errorMessages(errors.effective_to?.message)}
          />
        </FormRow>

        <Stack direction="row" gap="10px" alignItems="center">
          <CheckBox name="has_no_end_date" control={control} size="small" />

          <InputLabel>Bank Shift & Weekly Off has No End Date</InputLabel>
        </Stack>

        <TextField
          control={control}
          label="Remark"
          name="remark"
          fullWidth
          multiline
          loading={loading}
        />
      </Stack>
    );
  }
);

BankShiftAllocationForm.displayName = "BankShiftAllocationForm";

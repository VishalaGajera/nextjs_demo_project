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
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../hooks/useEnableDisableButton";
import { ShiftSchemeAutocomplete } from "../../../../../common/Autocomplete/ShiftSchemeAutocomplete";

const ShiftAllocationFormSchema = z
  .object({
    employee_id: z.array(z.string()).nullable(),
    current_date: z.string().nullable(),
    shift_type_id: z
      .string()
      .nullable()
      .refine((value) => !!value, { message: "common.required" }),
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

export type ShiftAllocationFormValues = z.infer<
  typeof ShiftAllocationFormSchema
>;

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<ShiftAllocationFormValues>) => void
  ) => void;
  setError: UseFormSetError<ShiftAllocationFormValues>;
};

type ShiftAllocationFormProps = {
  defaultValues?: ShiftAllocationFormValues;
  loading?: boolean;
  employeeIds?: string[];
  companyId: string;
};

const formDefaultValues: ShiftAllocationFormValues = {
  employee_id: null,
  current_date: null,
  shift_type_id: null,
  effective_from: null,
  effective_to: null,
  has_no_end_date: false,
  remark: null,
};

export const ShiftAllocationForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      employeeIds,
      companyId,
    }: ShiftAllocationFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const initialValues = useMemo(() => {
      return {
        ...defaultValues,
        employee_ids: employeeIds || null,
        current_date: DateTime.now().toISODate(),
      };
    }, [employeeIds]);

    const {
      watch,
      control,
      setError,
      clearErrors,
      setValue,
      formState: { errors },
      handleSubmit,
    } = useForm<ShiftAllocationFormValues>({
      defaultValues: initialValues,
      resolver: zodResolver(ShiftAllocationFormSchema),
      mode: "all",
    });

    useEnableDisableButton({
      control,
      defaultValues: initialValues,
      errors,
    });

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
        <ShiftSchemeAutocomplete
          control={control}
          loading={loading}
          companyId={companyId}
          fullWidth
          error={!!errors.shift_type_id}
          helperText={errorMessages(errors.shift_type_id?.message)}
          name="shift_type_id"
          required
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
            setError={setError}
            minDate={
              EffectiveFrom ? DateTime.fromISO(EffectiveFrom) : undefined
            }
            maxDate={DateTime.now().plus({ months: 3 })}
            required={HasNOEndDate ? false : true}
            label="Effective Up To"
            error={!!errors.effective_to}
            helperText={errorMessages(errors.effective_to?.message)}
          />
        </FormRow>

        <Stack direction="row" gap="10px" alignItems="center">
          <CheckBox name="has_no_end_date" control={control} size="small" />

          <InputLabel>Shift Has No End Date</InputLabel>
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

ShiftAllocationForm.displayName = "ShiftAllocationForm";

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
import { forwardRef, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../hooks/useEnableDisableButton";
import { OvertimeRuleAutocomplete } from "../../../../common/Autocomplete/OvertimeRuleAutocomplete";

const OvertimeRulesAllocationEditFormSchema = z
  .object({
    employee_ids: z.array(z.string()).nullable(),
    overtime_rule_id: z.string().nullable(),
    effective_from: z
      .string()
      .nullable()
      .refine((value) => !!value, { message: "common.required" }),
    effective_to: z.string().nullable(),
    unassigned_rule: z.boolean(),
    has_no_end_date: z.boolean(),
    remark: z.string().nullable(),
  })
  .superRefine((value, ctx) => {
    if (!value.unassigned_rule && !value.overtime_rule_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["overtime_rule_id"],
        message: "common.required",
      });
    }

    if (!value.has_no_end_date && !value.effective_to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["effective_to"],
        message: "common.required",
      });
    }
  });

export type OvertimeRulesAllocationEditFormValues = z.infer<
  typeof OvertimeRulesAllocationEditFormSchema
>;

export type FormRef = {
  submitForm: (
    onSubmit: (
      formValues: Partial<OvertimeRulesAllocationEditFormValues>
    ) => void
  ) => void;
  setError: UseFormSetError<OvertimeRulesAllocationEditFormValues>;
};

type OvertimeRulesAllocationEditFormProps = {
  defaultValues?: OvertimeRulesAllocationEditFormValues;
  loading?: boolean;
  employeeIds?: string[];
  companyId: string;
};

const formDefaultValues: OvertimeRulesAllocationEditFormValues = {
  employee_ids: null,
  overtime_rule_id: null,
  unassigned_rule: false,
  effective_from: null,
  effective_to: null,
  has_no_end_date: false,
  remark: null,
};

export const OvertimeRulesAllocationEditForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      employeeIds,
      companyId,
    }: OvertimeRulesAllocationEditFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const initialValues = useMemo(() => {
      return {
        ...defaultValues,
        employee_ids: employeeIds || null,
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
    } = useForm<OvertimeRulesAllocationEditFormValues>({
      defaultValues: initialValues,
      resolver: zodResolver(OvertimeRulesAllocationEditFormSchema),
      mode: "all",
    });

    useEnableDisableButton({
      control,
      defaultValues: initialValues,
      errors,
    });

    const HasNOEndDate = watch("has_no_end_date");

    const EffectiveTo = watch("effective_to");

    const unassigned_rule = watch("unassigned_rule");

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

    useMemo(() => {
      if (unassigned_rule) {
        setValue("overtime_rule_id", null, { shouldDirty: true });

        clearErrors("overtime_rule_id");
      }
    }, [unassigned_rule]);

    useMemo(() => {
      if (HasNOEndDate) {
        clearErrors("effective_to");
        setValue("effective_to", null, {
          shouldDirty: true,
        });
      }
    }, [HasNOEndDate]);

    return (
      <Stack gap="20px">
        <OvertimeRuleAutocomplete
          control={control}
          loading={loading}
          companyId={companyId}
          fullWidth
          disabled={unassigned_rule}
          error={!!errors.overtime_rule_id}
          required={unassigned_rule ? false : true}
          helperText={errorMessages(errors.overtime_rule_id?.message)}
          name="overtime_rule_id"
        />

        <Stack direction="row" gap="10px">
          <CheckBox
            name="unassigned_rule"
            loading={loading}
            control={control}
            size="small"
          />

          <InputLabel>Unassign Overtime Policy For Employee</InputLabel>
        </Stack>

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

          <InputLabel>Overtime Rule Has No End Date</InputLabel>
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

OvertimeRulesAllocationEditForm.displayName = "OvertimeRulesAllocationEditForm";

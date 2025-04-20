/* eslint-disable sonarjs/no-commented-code */

import {
  CheckBox,
  DatePicker,
  FormContainer,
  FormRow,
  FormSection,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputLabel, Stack } from "@mui/material";
import { t } from "i18next";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../../../../../../hooks/useEnableDisableButton";
import { dateDaysPlus } from "../../../../../../../../../../../utils/date";
import { filterNestedChangedFormFields } from "../../../../../../../../../../../utils/helper";
import { AttendancePenaltyRuleAutocomplete } from "../../../../../../../../../../common/Autocomplete/AttendancePenaltyRuleAutocomplete";
import {
  CHANGE_UPDATE_OF_DATA,
  CORRECTION_OF_DATA,
} from "../../../../EmployeeOrganizationDetails/BusinessUnit/Dialogs/EditBusinessUnitDialog/hooks/constant";
import {
  ActionTypeSchema,
  type OptionKey,
} from "../../../../EmployeeOrganizationDetails/BusinessUnit/Dialogs/EditBusinessUnitDialog/hooks/useTabOptions";

const AttendancePenaltyRuleSchema = z
  .object({
    id: z.string().nullable(),
    operationType: ActionTypeSchema,
    effective_from: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    has_no_end_date: z.boolean(),
    unassigned_rule: z.boolean(),
    effective_to: z.string().nullable(),
    remark: z.string().max(255, "common.maxLength").nullable(),
  })
  .superRefine((value, ctx) => {
    if (!value.unassigned_rule && !value.id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["id"],
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

export type AttendancePenaltyRuleFormFieldValues = z.infer<
  typeof AttendancePenaltyRuleSchema
>;

export type AttendancePenaltyRuleFormProps = {
  defaultValues?: AttendancePenaltyRuleFormFieldValues & {
    joining_date: string;
  };
  companyId: string;
  loading: boolean;
  operationType: OptionKey;
};
export type FormRef = {
  submitForm: (
    onSubmit: (
      formValues: Partial<AttendancePenaltyRuleFormFieldValues>
    ) => void
  ) => void;
  setError: UseFormSetError<AttendancePenaltyRuleFormFieldValues>;
};

const formDefaultValues: AttendancePenaltyRuleFormFieldValues = {
  id: null,
  effective_from: null,
  effective_to: null,
  has_no_end_date: false,
  unassigned_rule: false,
  remark: null,
  operationType: CORRECTION_OF_DATA,
};

export const AttendancePenaltyRuleForm = forwardRef(
  (
    {
      defaultValues,
      loading,
      companyId,
      operationType,
    }: AttendancePenaltyRuleFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const initialValues = useMemo(() => {
      return {
        ...formDefaultValues,
        ...defaultValues,
        effective_from: defaultValues?.effective_from
          ? defaultValues?.effective_from
          : (defaultValues?.joining_date ?? null),
      };
    }, [defaultValues]);

    const {
      watch,
      control,
      setError,
      clearErrors,
      formState: { errors, dirtyFields },
      handleSubmit,
      setValue,
    } = useForm({
      values: initialValues,
      resolver: zodResolver(AttendancePenaltyRuleSchema),
      mode: "all",
    });

    useEnableDisableButton({
      control,
      defaultValues: initialValues,
      errors,
    });

    const effective_from = watch("effective_from");

    const effective_to = watch("effective_to");

    const has_no_end_date = watch("has_no_end_date");

    const unassigned_rule = watch("unassigned_rule");

    useMemo(() => {
      if (has_no_end_date) {
        setValue("effective_to", null, { shouldDirty: true });

        clearErrors("effective_to");
      }
    }, [has_no_end_date]);

    useMemo(() => {
      if (unassigned_rule) {
        setValue("id", null, { shouldDirty: true });

        clearErrors("id");
      }
    }, [unassigned_rule]);

    useMemo(() => {
      setValue("operationType", operationType);

      setValue(
        "effective_to",
        operationType === CORRECTION_OF_DATA
          ? (defaultValues?.effective_to ?? null)
          : null
      );

      setValue(
        "id",
        operationType === CORRECTION_OF_DATA
          ? (defaultValues?.id ?? null)
          : null
      );

      setValue(
        "has_no_end_date",
        operationType === CORRECTION_OF_DATA
          ? (defaultValues?.has_no_end_date ?? false)
          : false
      );

      setValue(
        "unassigned_rule",
        operationType === CHANGE_UPDATE_OF_DATA
          ? false
          : (defaultValues?.unassigned_rule ?? false)
      );

      setValue(
        "effective_from",
        operationType === CORRECTION_OF_DATA
          ? (defaultValues?.effective_from ?? null)
          : null
      );

      clearErrors();
    }, [operationType]);

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues =
            operationType === CORRECTION_OF_DATA
              ? filterNestedChangedFormFields(formValues, dirtyFields)
              : { ...formValues };

          onSubmit(filterFormValues);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const effectiveFromMinDate = useMemo(() => {
      if (
        operationType === CORRECTION_OF_DATA ||
        !defaultValues?.effective_from
      ) {
        if (defaultValues?.joining_date) {
          return DateTime.fromISO(defaultValues?.joining_date);
        }

        return undefined;
      }

      const nextDate = dateDaysPlus(DateTime.now().toISODate(), 1);

      return nextDate ? DateTime.fromISO(nextDate) : undefined;
    }, [operationType, defaultValues]);

    const effectiveFromMaxDate = useMemo(() => {
      if (operationType === CORRECTION_OF_DATA) {
        if (effective_to) {
          return DateTime.fromISO(effective_to);
        }

        return DateTime.now().plus({ months: 3 });
      } else if (effective_to) {
        return DateTime.fromISO(effective_to);
      }

      return DateTime.now().plus({ months: 3 });
    }, [operationType, defaultValues, effective_to]);

    const effectiveToMinDate = useMemo(() => {
      if (operationType === CORRECTION_OF_DATA) {
        if (effective_from) {
          return DateTime.fromISO(effective_from);
        } else if (defaultValues?.joining_date) {
          return DateTime.fromISO(defaultValues?.joining_date);
        }

        return undefined;
      } else if (effective_from) {
        return DateTime.fromISO(effective_from);
      }

      const nextDate = dateDaysPlus(DateTime.now().toISODate(), 1);

      return nextDate ? DateTime.fromISO(nextDate) : undefined;
    }, [operationType, defaultValues, effective_from]);

    const effectiveToMaxDate = useMemo(() => {
      if (operationType === CORRECTION_OF_DATA) {
        if (defaultValues?.effective_to) {
          return DateTime.fromISO(defaultValues?.effective_to);
        }

        return DateTime.now().plus({ months: 3 });
      }

      return DateTime.now().plus({ months: 3 });
    }, [operationType, defaultValues]);

    return (
      <FormContainer>
        <FormSection>
          <FormRow fullWidth>
            <AttendancePenaltyRuleAutocomplete
              name="id"
              control={control}
              loading={loading}
              companyId={companyId}
              error={!!errors.id}
              required={unassigned_rule ? false : true}
              disabled={unassigned_rule}
              helperText={errorMessages(errors.id?.message)}
            />
          </FormRow>

          {defaultValues?.effective_from && (
            <FormRow>
              <Stack direction="row" gap="10px">
                <CheckBox
                  name="unassigned_rule"
                  loading={loading}
                  control={control}
                  size="small"
                />

                <InputLabel>
                  Unassign Attendance Penalty Rule For Employee
                </InputLabel>
              </Stack>
            </FormRow>
          )}

          <FormRow maxColumn={2}>
            <DatePicker
              name="effective_from"
              control={control}
              label="Effective From"
              loading={loading}
              setError={setError}
              required
              error={!!errors?.effective_from}
              minDate={effectiveFromMinDate}
              maxDate={effectiveFromMaxDate}
              helperText={errorMessages(errors?.effective_from?.message)}
            />

            <DatePicker
              name="effective_to"
              control={control}
              label="Effective Up To"
              loading={loading}
              setError={setError}
              required={has_no_end_date ? false : true}
              disabled={has_no_end_date}
              error={!!errors?.effective_to}
              minDate={effectiveToMinDate}
              maxDate={effectiveToMaxDate}
              helperText={errorMessages(errors?.effective_to?.message)}
            />
          </FormRow>

          <FormRow>
            <Stack direction="row" gap="10px">
              <CheckBox
                name="has_no_end_date"
                loading={loading}
                control={control}
                size="small"
              />

              <InputLabel>Attendance Penalty Rule Has No End Date</InputLabel>
            </Stack>
          </FormRow>

          <FormRow fullWidth>
            <TextField
              name="remark"
              control={control}
              label="Remark"
              loading={loading}
              error={!!errors.remark}
              helperText={errorMessages(errors.remark?.message)}
            />
          </FormRow>
        </FormSection>
      </FormContainer>
    );
  }
);
AttendancePenaltyRuleForm.displayName = "AttendancePenaltyRuleForm";

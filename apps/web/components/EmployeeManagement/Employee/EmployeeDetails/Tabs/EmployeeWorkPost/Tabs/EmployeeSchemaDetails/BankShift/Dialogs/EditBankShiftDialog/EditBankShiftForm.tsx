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
import { BankShiftSchemaAutocomplete } from "../../../../../../../../../../common/Autocomplete/BankShiftSchemaAutocomplete";
import { BankWeeklyOffAutocomplete } from "../../../../../../../../../../common/Autocomplete/BankWeeklyOffAutocomplete";
import { CORRECTION_OF_DATA } from "../../../../EmployeeOrganizationDetails/BusinessUnit/Dialogs/EditBusinessUnitDialog/hooks/constant";
import {
  ActionTypeSchema,
  type OptionKey,
} from "../../../../EmployeeOrganizationDetails/BusinessUnit/Dialogs/EditBusinessUnitDialog/hooks/useTabOptions";

const BankShiftSchema = z
  .object({
    id: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    weekly_off: z.string().nullable(),
    operationType: ActionTypeSchema,
    effective_from: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    has_no_end_date: z.boolean(),
    effective_to: z.string().nullable(),
    remark: z.string().max(255, "common.maxLength").nullable(),
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

export type EditBankShiftFormFieldValues = z.infer<typeof BankShiftSchema>;

export type EditBankShiftFormProps = {
  defaultValues?: EditBankShiftFormFieldValues & {
    joining_date: string;
  };
  companyId: string;
  loading: boolean;
  operationType: OptionKey;
};
export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<EditBankShiftFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<EditBankShiftFormFieldValues>;
};

const formDefaultValues: EditBankShiftFormFieldValues = {
  id: null,
  weekly_off: null,
  effective_from: null,
  effective_to: null,
  has_no_end_date: false,
  remark: null,
  operationType: CORRECTION_OF_DATA,
};

export const EditBankShiftForm = forwardRef(
  (
    {
      defaultValues,
      loading,
      companyId,
      operationType,
    }: EditBankShiftFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const initialValues = useMemo(() => {
      return { ...formDefaultValues, ...defaultValues };
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
      resolver: zodResolver(BankShiftSchema),
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

    useMemo(() => {
      if (has_no_end_date) {
        setValue("effective_to", null, { shouldDirty: true });

        clearErrors("effective_to");
      }
    }, [has_no_end_date]);

    useMemo(() => {
      setValue("operationType", operationType);

      setValue(
        "effective_to",
        operationType === CORRECTION_OF_DATA
          ? (defaultValues?.effective_to ?? null)
          : null
      );

      setValue(
        "has_no_end_date",
        operationType === CORRECTION_OF_DATA
          ? (defaultValues?.has_no_end_date ?? false)
          : false
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
      if (operationType === CORRECTION_OF_DATA) {
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
            <BankShiftSchemaAutocomplete
              required={true}
              name="id"
              control={control}
              loading={loading}
              companyId={companyId}
              error={!!errors.id}
              helperText={errorMessages(errors.id?.message)}
            />

            <BankWeeklyOffAutocomplete
              name="weekly_off"
              loading={loading}
              control={control}
              error={!!errors.weekly_off}
              helperText={errorMessages(errors.weekly_off?.message)}
            />
          </FormRow>

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

              <InputLabel>Bank Shift & Weekly Off Has No End Date</InputLabel>
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
EditBankShiftForm.displayName = "BankShiftForm";

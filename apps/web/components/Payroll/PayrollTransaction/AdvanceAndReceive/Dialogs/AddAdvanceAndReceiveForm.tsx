import { DatePicker, FormGridLayout, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../hooks/useEnableDisableButton";
import { dateYearsPlus } from "../../../../../utils/date";
import { filterChangedFormFields } from "../../../../../utils/helper";
import { wholeNumberRegex } from "../../../../../utils/regex";
import { CompanyAutocomplete } from "../../../../common/Autocomplete/CompanyAutocomplete";
import { ComponentTypeAutocomplete } from "../../../../common/Autocomplete/ComponentTypeAutocomplete";
import { EmployeeAutocomplete } from "../../../../common/Autocomplete/EmployeeAutoComplete";
import {
  PaymentTypeAutocomplete,
  PaymentTypeSchema,
} from "../../../../common/Autocomplete/PaymentTypeAutoComplete";
import { ComponentTypeSchema } from "../../../../common/Autocomplete/hooks/useGetComponentTypeOptions";

const AdvanceAndReceiveFormSchema = z.object({
  company_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  employee_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  component_type: z.union([
    ComponentTypeSchema.refine((value) => !!value, {
      message: "common.required",
    }),
    z.null(),
  ]),
  transaction_date: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  deduction_month: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  transaction_type: z.union([
    PaymentTypeSchema.refine((value) => !!value, {
      message: "common.required",
    }),
    z.null(),
  ]),
  amount: z
    .number()
    .min(1)
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    })
    .refine(
      (value) => {
        const num = Number(value);

        return num > 0 && wholeNumberRegex.test(String(value));
      },
      {
        message: "common.invalidNumber",
      }
    ),
  remark: z
    .string()
    .max(500, {
      message: t("common.invalidMaxLimit", { maxLimit: 500 }),
    })
    .trim()
    .nullable(),
});

export type AdvanceAndReceiveFormFieldValues = z.infer<
  typeof AdvanceAndReceiveFormSchema
>;

type AddAdvanceAndReceiveFormProps = {
  defaultValues?: AdvanceAndReceiveFormFieldValues;
  loading?: boolean;
  isView?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<AdvanceAndReceiveFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<AdvanceAndReceiveFormFieldValues>;
};

const formDefaultValues: AdvanceAndReceiveFormFieldValues = {
  company_id: null,
  employee_id: null,
  component_type: null,
  transaction_date: null,
  deduction_month: null,
  transaction_type: null,
  amount: null,
  remark: null,
};

export const AddAdvanceAndReceiveForm = forwardRef(
  (
    {
      isView = false,
      loading = false,
      defaultValues = formDefaultValues,
    }: AddAdvanceAndReceiveFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const {
      watch,
      control,
      setError,
      setValue,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(AdvanceAndReceiveFormSchema),
      mode: "all",
    });

    const companyId = watch("company_id") ?? "";

    const transactionType = watch("transaction_date");

    const deductionMonth = watch("deduction_month");

    useEffect(() => {
      if (!defaultValues.component_type) {
        setValue("component_type", "advance", {
          shouldDirty: true,
        });
      }

      if (!defaultValues.transaction_type) {
        setValue("transaction_type", "bank", {
          shouldDirty: true,
        });
      }
    }, [defaultValues]);

    useMemo(() => {
      if (transactionType && !deductionMonth) {
        setValue("deduction_month", transactionType, {
          shouldDirty: true,
          shouldValidate: true,
        });
      } else if (!transactionType && deductionMonth) {
        setValue("deduction_month", null);
      }
    }, [deductionMonth, transactionType]);

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(
            {
              ...formValues,
              deduction_month: formValues.deduction_month
                ? DateTime.fromISO(formValues.deduction_month).toFormat(
                    "yyyy-MM"
                  )
                : null,
            },
            {
              ...dirtyFields,
              company_id: false,
            }
          );

          onSubmit(filterFormValues);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const maxDate = dateYearsPlus(DateTime.now().toISODate(), 1);

    const isMaxDateValid = maxDate ? DateTime.fromISO(maxDate) : undefined;

    const {
      company_id,
      employee_id,
      component_type,
      transaction_date,
      deduction_month,
      amount,
      transaction_type,
      remark,
    } = errors;

    return (
      <FormGridLayout columns={3}>
        <CompanyAutocomplete
          name="company_id"
          disabled={!!defaultValues.company_id || isView}
          control={control}
          loading={loading}
          required
          label="Company"
          error={!!company_id}
          helperText={errorMessages(company_id?.message)}
        />

        <EmployeeAutocomplete
          name="employee_id"
          disabled={!companyId || !!defaultValues.company_id}
          label="Employee"
          placeholder="Employee"
          control={control}
          loading={loading}
          companyId={companyId}
          required
          error={!!employee_id}
          helperText={errorMessages(employee_id?.message)}
        />

        <ComponentTypeAutocomplete
          disabled={!!defaultValues.employee_id}
          name="component_type"
          control={control}
          loading={loading}
          required
          error={!!component_type}
          helperText={errorMessages(component_type?.message)}
        />

        <DatePicker
          disabled={isView}
          name="transaction_date"
          setError={setError}
          control={control}
          loading={loading}
          label="Transaction Date"
          required
          maxDate={
            deductionMonth ? DateTime.fromISO(deductionMonth) : undefined
          }
          error={!!transaction_date}
          helperText={errorMessages(transaction_date?.message)}
        />

        <DatePicker
          name="deduction_month"
          label="Deduction Month/Year"
          format="MMM yyyy"
          views={["year", "month"]}
          disabled={!transactionType || isView}
          control={control}
          minDate={
            transactionType ? DateTime.fromISO(transactionType) : undefined
          }
          maxDate={isMaxDateValid}
          required
          error={!!deduction_month}
          setError={setError}
          helperText={errorMessages(deduction_month?.message)}
          loading={loading}
        />

        <PaymentTypeAutocomplete
          name="transaction_type"
          label="Transaction Type"
          placeholder="Select Transaction Type"
          control={control}
          loading={loading}
          disabled={isView}
          required
          disableClearable
          error={!!transaction_type}
          helperText={errorMessages(transaction_type?.message)}
        />

        <TextField
          label="Amount"
          placeholder="Enter Amount"
          type="number"
          name="amount"
          required
          disabled={isView}
          control={control}
          loading={loading}
          error={!!amount}
          helperText={errorMessages(amount?.message)}
        />

        <TextField
          name="remark"
          label="Remark"
          disabled={isView}
          loading={loading}
          control={control}
          error={!!remark}
          helperText={errorMessages(remark?.message)}
        />
      </FormGridLayout>
    );
  }
);

AddAdvanceAndReceiveForm.displayName = "AddAdvanceAndReceiveForm";

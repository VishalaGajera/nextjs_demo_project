import {
  DatePicker,
  FormGridLayout,
  FormSection,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Percent } from "@mui/icons-material";
import { InputAdornment, Stack } from "@mui/material";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useSearchParams } from "next/navigation";
import {
  type ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import type { UseFormSetError } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDebounceValue } from "usehooks-ts";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../hooks/useEnableDisableButton";
import {
  Debounce_Delay,
  filterNestedChangedFormFields,
} from "../../../../../utils/helper";
import { wholeNumberRegex } from "../../../../../utils/regex";
import { CompanyAutocomplete } from "../../../../common/Autocomplete/CompanyAutocomplete";
import { EmployeeWithLoanPolicyAutocomplete } from "../../../../common/Autocomplete/EmployeeWithLoanPolicyAutocomplete";
import { GuarantorAutocomplete } from "../../../../common/Autocomplete/GuarantorAutocomplete";
import { useGetEmployeeOption } from "../../../../common/Autocomplete/hooks/useGetEmployeeOption";
import { InterestTypeAutocomplete } from "../../../../common/Autocomplete/InterestTypeAutocomplete";
import { LoanCategoryAutocomplete } from "../../../../common/Autocomplete/LoanCategoryAutocomplete";
import {
  PaymentTypeAutocomplete,
  PaymentTypeSchema,
} from "../../../../common/Autocomplete/PaymentTypeAutoComplete";
import { LoanEMISection } from "./LoanEMISection";

const Installments = z
  .array(
    z.object({
      installment_month: z
        .string()
        .nullable()
        .refine((value) => !!value, {
          message: "common.required",
        }),
      principle_amount: z.number().min(0),
      interest_amount: z.number().min(0),
      installment_amount: z.number().nullable(),
      outstanding_amount: z.number().min(0),
    })
  )
  .nullable();

const LoanFormSchema = z.object({
  company_id: z
    .string()
    .nullable()
    .refine((value) => !!value, { message: "common.required" }),
  employee_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  loan_category_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  amount: z
    .union([z.number().nullable(), z.string().nullable()])
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
  interest_rate: z
    .union([
      z.string(),
      z.number().max(100, {
        message: t("common.invalidMaxLimit", { maxLimit: 100 }),
      }),
    ])
    .nullable()
    .refine((value) => value !== null && value != undefined && value !== "", {
      message: "common.required",
    })
    .refine(
      (value) => {
        if (value === null || value == undefined || value === "") {
          return false;
        }

        const numberValue =
          typeof value === "string" ? parseFloat(value) : value;

        return (
          !isNaN(numberValue) &&
          /^\d+(\.\d{1,2})?$/.test(numberValue.toString())
        );
      },
      { message: "common.invalidTime" }
    ),
  interest_calculation_type: z
    .enum(["flat", "reduce"])
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  tenure_in_months: z
    .union([
      z
        .number()
        .int()
        .positive()
        .min(0, { message: "common.required" })
        .max(360, { message: "common.invalidTime" })
        .nullable(),
      z.string().nullable(),
    ])
    .refine((value) => !!value, {
      message: "common.required",
    }),
  disbursement_date: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  repayment_start_date: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  payment_method: PaymentTypeSchema.refine((value) => !!value, {
    message: "common.required",
  }),
  referred_by: z.string().max(255, "common.maxLength").nullable().optional(),
  primary_guarantor_id: z.string().nullable().optional(),
  secondary_guarantor_id: z.string().nullable().optional(),
  remark: z
    .string()
    .max(500, "common.maxCharacterLength")
    .nullable()
    .optional(),
  is_autofill_installmants: z.boolean().optional(),
  installments: Installments,
});

export type LoanFormFieldValues = z.infer<typeof LoanFormSchema>;

export type LoanFormProps = {
  defaultValues?: Partial<LoanFormFieldValues>;
  setSummaryMismatch?: (value: boolean) => void;
  loading?: boolean;
  isEdit?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<LoanFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<LoanFormFieldValues>;
};

const formDefaultValues: LoanFormFieldValues = {
  company_id: null,
  employee_id: null,
  loan_category_id: null,
  amount: null,
  interest_rate: null,
  interest_calculation_type: "flat",
  tenure_in_months: null,
  disbursement_date: null,
  repayment_start_date: null,
  payment_method: "cash",
  referred_by: null,
  primary_guarantor_id: null,
  secondary_guarantor_id: null,
  remark: null,
  is_autofill_installmants: true,
  installments: null,
};

export const LoanForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      setSummaryMismatch,
      loading = false,
      isEdit = false,
    }: LoanFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const searchParams = useSearchParams();

    const mode = searchParams.get("page");

    const isViewMode = mode === "view-loan";

    const methods = useForm({
      values: defaultValues,
      resolver: zodResolver(LoanFormSchema),
      mode: "all",
    });

    const {
      watch,
      setValue,
      setError,
      clearErrors,
      control,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = methods;

    const companyId = watch("company_id") ?? "";

    const employeeId = watch("employee_id");

    const primaryGuarantor = watch("primary_guarantor_id");

    const secondaryGuarantor = watch("secondary_guarantor_id");

    const disbursementDate = watch("disbursement_date");

    const repaymentStartDate = watch("repayment_start_date");

    const installments = watch("installments");

    const [formatted_disbursement_date] = useDebounceValue(
      disbursementDate
        ? DateTime.fromISO(disbursementDate).toFormat("yyyy-MM")
        : "",
      Debounce_Delay
    );

    const [formatted_repayment_start_date] = useDebounceValue(
      repaymentStartDate
        ? DateTime.fromISO(repaymentStartDate).toFormat("yyyy-MM")
        : "",
      Debounce_Delay
    );

    const { data: employeeOptions } = useGetEmployeeOption({
      companyId,
      queryParams: {},
    });

    const isDisabled = isEdit || isViewMode;

    const getFilteredGuarantorOptions = (
      options: typeof employeeOptions,
      currentId: string | number | null | undefined,
      otherSelectedIds: (string | number | null | undefined)[]
    ) => {
      const excludeIds = otherSelectedIds.filter(
        (id): id is string | number =>
          (typeof id === "string" || typeof id === "number") && id !== currentId
      );

      return options?.filter((user) => !excludeIds.includes(user.value));
    };

    const primaryGuarantorOptions = getFilteredGuarantorOptions(
      employeeOptions,
      primaryGuarantor,
      [employeeId, secondaryGuarantor]
    );

    const secondaryGuarantorOptions = getFilteredGuarantorOptions(
      employeeOptions,
      secondaryGuarantor,
      [employeeId, primaryGuarantor]
    );

    useMemo(() => {
      if (disbursementDate && !repaymentStartDate) {
        setValue("repayment_start_date", disbursementDate, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }, [disbursementDate]);

    useMemo(() => {
      if (!disbursementDate) {
        setValue("repayment_start_date", null);
        setValue("installments", []);
        clearErrors(["disbursement_date", "repayment_start_date"]);
      }

      if (!repaymentStartDate) {
        setValue("installments", []);
        clearErrors(["disbursement_date", "repayment_start_date"]);
      }
    }, [disbursementDate, repaymentStartDate]);

    useEnableDisableButton({
      control,
      defaultValues,
      errors,
    });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterNestedChangedFormFields(formValues, {
            ...dirtyFields,
            company_id: false,
            interest_calculation_type: true,
            payment_method: true,
            is_autofill_installmants: false,
          });

          const basePayload = {
            ...filterFormValues,
            ...(dirtyFields.disbursement_date && {
              disbursement_date: formatted_disbursement_date,
            }),
            ...(dirtyFields.repayment_start_date && {
              repayment_start_date: formatted_repayment_start_date,
            }),
            installments,
          };

          const finalPayload = isEdit
            ? {
                referred_by: filterFormValues.referred_by,
                primary_guarantor_id: filterFormValues.primary_guarantor_id,
                secondary_guarantor_id: filterFormValues.secondary_guarantor_id,
                remark: filterFormValues.remark,
              }
            : basePayload;

          onSubmit(finalPayload);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const {
      company_id,
      employee_id,
      loan_category_id,
      amount,
      interest_rate,
      interest_calculation_type,
      tenure_in_months,
      disbursement_date,
      repayment_start_date,
      payment_method,
      referred_by,
      primary_guarantor_id,
      secondary_guarantor_id,
      remark,
    } = errors;

    return (
      <Stack gap="16px">
        <FormProvider {...methods}>
          <FormSection title="Loan Details">
            <FormGridLayout columns={3}>
              <CompanyAutocomplete
                name="company_id"
                required
                control={control}
                loading={loading}
                disabled={isDisabled}
                error={!!company_id}
                helperText={errorMessages(company_id?.message)}
              />

              <EmployeeWithLoanPolicyAutocomplete
                name="employee_id"
                control={control}
                companyId={companyId}
                required
                loading={loading}
                disabled={!companyId || isDisabled}
                error={!!employee_id}
                helperText={errorMessages(employee_id?.message)}
              />

              <LoanCategoryAutocomplete
                name="loan_category_id"
                required
                control={control}
                loading={loading}
                disabled={isDisabled}
                error={!!loan_category_id}
                helperText={errorMessages(loan_category_id?.message)}
              />

              <TextField
                name="amount"
                label="Loan Amount"
                type="number"
                control={control}
                required
                loading={loading}
                disabled={isDisabled}
                error={!!amount}
                helperText={errorMessages(amount?.message)}
              />

              <TextField
                name="interest_rate"
                label="Interest Rate"
                type="number"
                control={control}
                required
                error={!!interest_rate}
                loading={loading}
                disabled={isDisabled}
                helperText={errorMessages(interest_rate?.message)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Percent fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <InterestTypeAutocomplete
                name="interest_calculation_type"
                required
                disabled
                control={control}
                loading={loading}
                error={!!interest_calculation_type}
                helperText={errorMessages(interest_calculation_type?.message)}
              />

              <TextField
                name="tenure_in_months"
                label="Repayment Term (Months)"
                type="number"
                control={control}
                required
                loading={loading}
                disabled={isDisabled}
                error={!!tenure_in_months}
                helperText={errorMessages(tenure_in_months?.message)}
              />

              <DatePicker
                name="disbursement_date"
                label="Loan Date"
                control={control}
                required
                loading={loading}
                setError={setError}
                disabled={isDisabled}
                error={!!disbursement_date}
                helperText={errorMessages(disbursement_date?.message)}
              />

              <DatePicker
                name="repayment_start_date"
                label="EMII Deduct From"
                format="MMM yyyy"
                views={["year", "month"]}
                control={control}
                minDate={
                  disbursementDate
                    ? DateTime.fromISO(disbursementDate)
                    : undefined
                }
                maxDate={DateTime.now().plus({ years: 1 })}
                disabled={!disbursementDate || isDisabled}
                loading={loading}
                required
                setError={setError}
                error={!!repayment_start_date}
                helperText={errorMessages(repayment_start_date?.message)}
              />

              <PaymentTypeAutocomplete
                name="payment_method"
                required
                control={control}
                error={!!payment_method}
                loading={loading}
                disabled={isDisabled}
                helperText={errorMessages(payment_method?.message)}
              />

              <TextField
                name="referred_by"
                label="Reference By"
                control={control}
                error={!!referred_by}
                loading={loading}
                disabled={isViewMode}
                helperText={errorMessages(referred_by?.message)}
              />

              <GuarantorAutocomplete
                label="Guarantor 1"
                options={primaryGuarantorOptions}
                name="primary_guarantor_id"
                control={control}
                loading={loading}
                disabled={!companyId || isViewMode}
                error={!!primary_guarantor_id}
                helperText={errorMessages(primary_guarantor_id?.message)}
              />

              <GuarantorAutocomplete
                label="Guarantor 2"
                options={secondaryGuarantorOptions}
                name="secondary_guarantor_id"
                control={control}
                loading={loading}
                disabled={!companyId || isViewMode}
                error={!!secondary_guarantor_id}
                helperText={errorMessages(secondary_guarantor_id?.message)}
              />

              <TextField
                name="remark"
                label="Remark"
                control={control}
                error={!!remark}
                loading={loading}
                disabled={isViewMode}
                helperText={errorMessages(remark?.message)}
              />
            </FormGridLayout>
          </FormSection>

          <LoanEMISection
            isEdit={isEdit}
            isViewMode={isViewMode}
            loading={loading}
            setSummaryMismatch={setSummaryMismatch}
          />
        </FormProvider>
      </Stack>
    );
  }
);

LoanForm.displayName = "LoanForm";

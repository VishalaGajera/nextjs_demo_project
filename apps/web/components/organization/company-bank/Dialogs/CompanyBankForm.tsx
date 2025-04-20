import { FormRow, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { type ForwardedRef, forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../hooks/useEnableDisableButton";
import { filterChangedFormFields } from "../../../../utils/helper";
import { bankAcNoRegex, ifscRegex } from "../../../../utils/regex";
import { BankAutocomplete } from "../../../common/Autocomplete/BankAutocomplete";
import { CompanyAutocomplete } from "../../../common/Autocomplete/CompanyAutocomplete";

const CompanyBankFormSchema = z.object({
  company_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  bank_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  branch_name: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  ifsc_code: z
    .string()
    .regex(ifscRegex, "common.ifsc_code.invalid")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  account_no: z
    .string()
    .regex(bankAcNoRegex, "common.account_no.invalid")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type CompanyBankFormFieldValues = z.infer<typeof CompanyBankFormSchema>;

type CompanyBankFormProps = {
  defaultValues?: CompanyBankFormFieldValues;
  loading?: boolean;
  disabled?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<CompanyBankFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<CompanyBankFormFieldValues>;
};

const formDefaultValues: CompanyBankFormFieldValues = {
  company_id: null,
  bank_id: null,
  branch_name: null,
  ifsc_code: null,
  account_no: null,
};

export const CompanyBankForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
    }: CompanyBankFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const {
      control,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(CompanyBankFormSchema),
      mode: "all",
    });

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(
            formValues,
            dirtyFields
          );

          onSubmit(filterFormValues);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    return (
      <Stack gap="16px">
        <FormRow>
          <CompanyAutocomplete
            control={control}
            error={!!errors.company_id}
            loading={loading}
            disabled={!!defaultValues.company_id || disabled}
            helperText={errorMessages(errors.company_id?.message)}
            name="company_id"
            required
          />

          <BankAutocomplete
            control={control}
            error={!!errors.bank_id}
            loading={loading}
            helperText={errorMessages(errors.bank_id?.message)}
            name="bank_id"
            required
            disabled={disabled}
          />

          <TextField
            control={control}
            label="Branch Name"
            loading={loading}
            name="branch_name"
            required
            error={!!errors.branch_name}
            helperText={errorMessages(errors.branch_name?.message)}
            disabled={disabled}
          />
        </FormRow>

        <FormRow>
          <TextField
            name="ifsc_code"
            control={control}
            label="Bank IFSC Code"
            required
            isCapitalize
            loading={loading}
            error={!!errors.ifsc_code}
            helperText={errorMessages(errors.ifsc_code?.message)}
            placeholder="Enter Bank IFSC Code"
            disabled={disabled}
          />

          <TextField
            control={control}
            label="Account No"
            name="account_no"
            required
            loading={loading}
            error={!!errors.account_no}
            helperText={errorMessages(errors.account_no?.message)}
            disabled={disabled}
          />
        </FormRow>
      </Stack>
    );
  }
);

CompanyBankForm.displayName = "CompanyBankForm";

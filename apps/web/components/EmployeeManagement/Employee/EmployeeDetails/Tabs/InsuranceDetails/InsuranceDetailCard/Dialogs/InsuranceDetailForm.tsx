import {
  DatePicker,
  FormContainer,
  FormRow,
  FormSection,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../../../hooks/useEnableDisableButton";
import { filterChangedFormFields } from "../../../../../../../../utils/helper";
import { InsuranceTypeAutocomplete } from "../../../../../../../common/Autocomplete/InsuranceTypeAutocomplete";
import { InsuranceRelationShipAutocomplete } from "../../../../../../../common/Autocomplete/RelationshipAutocomplete/InsuranceRelationShipAutocomplete";
import type { PayloadInsurance } from "./hooks/useAddInsuranceDetails";

const InsuranceDetailFormSchema = z.object({
  insurance_type: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  insured_name: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  insurance_provider: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  policy_no: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  insured_amount: z
    .number()
    .min(0, "common.minValue")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    })
    .refine((value) => value && value.toString().length < 9, {
      message: t("common.maxDigitLimit", { maxLimit: 9 }),
    }),
  relation: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  issue_date: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  expiry_date: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type InsuranceDetailFormFieldValues = z.infer<
  typeof InsuranceDetailFormSchema
>;

type InsuranceDetailProps = {
  defaultValues?: InsuranceDetailFormFieldValues;
  loading?: boolean;
  disabled?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<InsuranceDetailFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<InsuranceDetailFormFieldValues>;
};

const formDefaultValues: InsuranceDetailFormFieldValues = {
  insurance_type: null,
  insured_name: null,
  insurance_provider: null,
  policy_no: null,
  insured_amount: null,
  relation: null,
  issue_date: null,
  expiry_date: null,
};

export const InsuranceDetailForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
    }: InsuranceDetailProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      control,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(InsuranceDetailFormSchema),
      mode: "all",
    });

    useEnableDisableButton({ control, defaultValues, errors });

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(
            formValues,
            dirtyFields
          );

          const payloadData: PayloadInsurance = {
            insurance_type: filterFormValues.insurance_type,
            insured_name: filterFormValues.insured_name,
            insurance_provider: filterFormValues.insurance_provider,
            policy_no: filterFormValues.policy_no,
            insured_amount: filterFormValues.insured_amount,
            relation: filterFormValues.relation,
            issue_date: filterFormValues.issue_date,
            expiry_date: filterFormValues.expiry_date,
          };

          onSubmit(payloadData);
        })();
      },
      setError,
    }));

    return (
      <FormContainer>
        <FormSection>
          <FormRow maxColumn={2}>
            <InsuranceTypeAutocomplete
              control={control}
              name="insurance_type"
              loading={loading}
              required
              error={!!errors.insurance_type}
              helperText={errorMessages(errors.insurance_type?.message)}
              disabled={disabled}
            />
            <TextField
              control={control}
              label="Policy Number"
              name="policy_no"
              loading={loading}
              required
              error={!!errors.policy_no}
              helperText={errorMessages(errors.policy_no?.message)}
              disabled={disabled}
            />
          </FormRow>
          <FormRow maxColumn={2}>
            <TextField
              control={control}
              label="Name Of Insured"
              name="insured_name"
              loading={loading}
              required
              error={!!errors.insured_name}
              helperText={errorMessages(errors.insured_name?.message)}
              disabled={disabled}
            />
            <TextField
              control={control}
              label="Sum Insured"
              name="insured_amount"
              type="number"
              loading={loading}
              required
              error={!!errors.insured_amount}
              helperText={errorMessages(errors.insured_amount?.message)}
              disabled={disabled}
            />
          </FormRow>
          <FormRow maxColumn={2}>
            <InsuranceRelationShipAutocomplete
              control={control}
              name="relation"
              loading={loading}
              required
              error={!!errors.relation}
              helperText={errorMessages(errors.relation?.message)}
              disabled={disabled}
            />
            <DatePicker
              name="issue_date"
              control={control}
              label="Issue Date"
              loading={loading}
              required
              error={!!errors.issue_date}
              helperText={errorMessages(errors.issue_date?.message)}
              disabled={disabled}
            />
          </FormRow>
          <FormRow maxColumn={2}>
            <TextField
              control={control}
              label="Insurance Provider"
              name="insurance_provider"
              loading={loading}
              required
              error={!!errors.insurance_provider}
              helperText={errorMessages(errors.insurance_provider?.message)}
              disabled={disabled}
            />
            <DatePicker
              name="expiry_date"
              control={control}
              label="Expiry Date"
              loading={loading}
              required
              error={!!errors.expiry_date}
              helperText={errorMessages(errors.expiry_date?.message)}
              disabled={disabled}
            />
          </FormRow>
        </FormSection>
      </FormContainer>
    );
  }
);

InsuranceDetailForm.displayName = "InsuranceDetailForm";

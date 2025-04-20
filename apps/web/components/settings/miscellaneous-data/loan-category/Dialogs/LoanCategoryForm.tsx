import { FormRow, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../hooks/useEnableDisableButton";
import { filterChangedFormFields } from "../../../../../utils/helper";

const LoanCategoryFormSchema = z.object({
  loan_category_code: z
    .string()
    .max(10, "common.maxCodeLength")
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  loan_category_name: z
    .string()
    .max(50, "common.maxLength.fifty")
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  description: z.string().max(255, "common.maxLength").trim().nullable(),
});

export type LoanCategoryFormFieldValues = z.infer<
  typeof LoanCategoryFormSchema
>;

type LoanCategoryFormProps = {
  defaultValues?: LoanCategoryFormFieldValues;
  loading?: boolean;
  disabled?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<LoanCategoryFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<LoanCategoryFormFieldValues>;
};

const formDefaultValues: LoanCategoryFormFieldValues = {
  loan_category_code: null,
  loan_category_name: null,
  description: null,
};

export const LoanCategoryForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
    }: LoanCategoryFormProps,
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
      resolver: zodResolver(LoanCategoryFormSchema),
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
        <FormRow maxColumn={2}>
          <TextField
            name="loan_category_code"
            loading={loading}
            control={control}
            label="Loan Category Code"
            required
            disabled={!!defaultValues.loan_category_code || disabled}
            error={!!errors.loan_category_code}
            helperText={errorMessages(errors.loan_category_code?.message)}
          />

          <TextField
            name="loan_category_name"
            control={control}
            label="Loan Category Name"
            required
            loading={loading}
            error={!!errors.loan_category_name}
            helperText={errorMessages(errors.loan_category_name?.message)}
            disabled={disabled}
          />
        </FormRow>

        <TextField
          name="description"
          control={control}
          label="Description"
          loading={loading}
          error={!!errors.description}
          helperText={errorMessages(errors.description?.message)}
          disabled={disabled}
        />
      </Stack>
    );
  }
);

LoanCategoryForm.displayName = "LoanCategoryForm";

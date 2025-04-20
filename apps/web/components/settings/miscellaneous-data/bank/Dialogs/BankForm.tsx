import { FormRow, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { type ForwardedRef, forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../hooks/useEnableDisableButton";
import { filterChangedFormFields } from "../../../../../utils/helper";

const BankFormSchema = z.object({
  bank_code: z
    .string()
    .max(10, "common.maxCodeLength")
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  bank_name: z
    .string()
    .max(255, "common.maxLength")
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  description: z.string().max(255, "common.maxLength").nullable(),
});

export type BankFormFieldValues = z.infer<typeof BankFormSchema>;

type BankFormProps = {
  defaultValues?: BankFormFieldValues;
  loading?: boolean;
  disabled?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<BankFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<BankFormFieldValues>;
};

const formDefaultValues: BankFormFieldValues = {
  bank_code: null,
  bank_name: null,
  description: null,
};

export const BankForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
    }: BankFormProps,
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
      resolver: zodResolver(BankFormSchema),
      mode: "all",
    });

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          //TODO: Manish, need to add default value.
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
            name="bank_code"
            control={control}
            label="Bank Code"
            required
            disabled={!!defaultValues.bank_code || disabled}
            loading={loading}
            error={!!errors.bank_code}
            helperText={errorMessages(errors.bank_code?.message)}
          />

          <TextField
            name="bank_name"
            control={control}
            label="Bank Name"
            required
            loading={loading}
            error={!!errors.bank_name}
            helperText={errorMessages(errors.bank_name?.message)}
            disabled={disabled}
          />
        </FormRow>

        <FormRow maxColumn={2}>
          <TextField
            name="description"
            control={control}
            label="Description"
            loading={loading}
            error={!!errors.description}
            helperText={errorMessages(errors.description?.message)}
            disabled={disabled}
          />
        </FormRow>
      </Stack>
    );
  }
);

BankForm.displayName = "BankForm";

import { FormRow, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import {
  type ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../hooks/useEnableDisableButton";
import { filterChangedFormFields } from "../../../../../utils/helper";
import { CompanyAutocomplete } from "../../../../common/Autocomplete/CompanyAutocomplete";

const DesignationFormSchema = z.object({
  company_id: z
    .string()
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  designation_code: z
    .string()
    .max(10, "common.maxCodeLength")
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  designation_name: z
    .string()
    .max(255, "common.maxLength")
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  description: z.string().max(255, "common.maxLength").nullable(),
  is_active: z.boolean().nullable().optional(),
});

export type DesignationFormFieldValues = z.infer<typeof DesignationFormSchema>;

export type DesignationFormProps = {
  defaultValues?: Partial<DesignationFormFieldValues>;
  loading?: boolean;
  disabled?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<DesignationFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<DesignationFormFieldValues>;
};

const formDefaultValues: DesignationFormFieldValues = {
  company_id: null,
  designation_code: null,
  designation_name: null,
  description: null,
  is_active: true,
};

export const DesignationForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
    }: DesignationFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const initialValues = useMemo(() => {
      return { ...formDefaultValues, ...defaultValues };
    }, [defaultValues]);

    const {
      control,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: initialValues,
      resolver: zodResolver(DesignationFormSchema),
      mode: "all",
    });

    useEnableDisableButton({
      control,
      defaultValues: initialValues,
      errors,
    });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          //TODO: Manish, need to add default value.
          const filterFormValues = filterChangedFormFields(formValues, {
            ...dirtyFields,
            company_id: true,
          });

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
          <CompanyAutocomplete
            control={control}
            loading={loading}
            error={!!errors.company_id}
            disabled={!!defaultValues.company_id || disabled}
            helperText={errorMessages(errors.company_id?.message)}
            name="company_id"
            required
          />

          <TextField
            name="designation_code"
            control={control}
            label="Designation Code"
            loading={loading}
            disabled={!!defaultValues.designation_code || disabled}
            required
            error={!!errors.designation_code}
            helperText={errorMessages(errors.designation_code?.message)}
          />
        </FormRow>

        <FormRow maxColumn={2}>
          <TextField
            name="designation_name"
            control={control}
            label="Designation Name"
            required
            loading={loading}
            error={!!errors.designation_name}
            helperText={errorMessages(errors.designation_name?.message)}
            disabled={disabled}
          />

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

DesignationForm.displayName = "DesignationForm";

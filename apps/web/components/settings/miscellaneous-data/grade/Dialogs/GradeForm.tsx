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

const GradeFormSchema = z.object({
  company_id: z
    .string()
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  grade_name: z
    .string()
    .max(255, "common.maxLength")
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  grade_code: z
    .string()
    .max(10, "common.maxCodeLength")
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  description: z.string().max(255, "common.maxLength").nullable(),
  is_active: z.boolean().nullable().optional(),
});

export type GradeFormFieldValues = z.infer<typeof GradeFormSchema>;

export type GradeFormProps = {
  defaultValues?: Partial<GradeFormFieldValues>;
  loading?: boolean;
  disabled?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<GradeFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<GradeFormFieldValues>;
};

const formDefaultValues: GradeFormFieldValues = {
  company_id: null,
  grade_name: null,
  grade_code: null,
  description: null,
  is_active: true,
};

export const GradeForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
    }: GradeFormProps,
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
      resolver: zodResolver(GradeFormSchema),
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
            disabled={!!defaultValues.company_id || disabled}
            error={!!errors.company_id}
            helperText={errorMessages(errors.company_id?.message)}
            name="company_id"
            required
          />

          <TextField
            name="grade_code"
            control={control}
            loading={loading}
            label="Grade Code"
            required
            disabled={!!defaultValues.grade_code || disabled}
            error={!!errors.grade_code}
            helperText={errorMessages(errors.grade_code?.message)}
          />
        </FormRow>

        <FormRow maxColumn={2}>
          <TextField
            name="grade_name"
            control={control}
            label="Grade Name"
            required
            loading={loading}
            error={!!errors.grade_name}
            helperText={errorMessages(errors.grade_name?.message)}
            disabled={disabled}
          />

          <TextField
            name="description"
            control={control}
            loading={loading}
            label="Description"
            error={!!errors.description}
            helperText={errorMessages(errors.description?.message)}
            disabled={disabled}
          />
        </FormRow>
      </Stack>
    );
  }
);

GradeForm.displayName = "GradeForm";

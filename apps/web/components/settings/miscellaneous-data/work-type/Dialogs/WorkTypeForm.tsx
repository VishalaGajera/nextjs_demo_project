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

const WorkTypeFormSchema = z.object({
  company_id: z
    .string()
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  work_type_code: z
    .string()
    .max(10, "common.maxCodeLength")
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  work_type_name: z
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

export type WorkTypeFormFieldValues = z.infer<typeof WorkTypeFormSchema>;

export type WorkTypeFormProps = {
  defaultValues?: Partial<WorkTypeFormFieldValues>;
  loading?: boolean;
  disabled?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<WorkTypeFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<WorkTypeFormFieldValues>;
};

const formDefaultValues: WorkTypeFormFieldValues = {
  company_id: null,
  work_type_name: null,
  work_type_code: null,
  description: null,
  is_active: true,
};

export const WorkTypeForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
    }: WorkTypeFormProps,
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
      resolver: zodResolver(WorkTypeFormSchema),
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
            name="work_type_code"
            control={control}
            label="Work Type Code"
            disabled={!!defaultValues.work_type_code || disabled}
            required
            loading={loading}
            error={!!errors.work_type_code}
            helperText={errorMessages(errors.work_type_code?.message)}
          />
        </FormRow>

        <FormRow maxColumn={2}>
          <TextField
            name="work_type_name"
            control={control}
            label="Work Type Name"
            required
            loading={loading}
            error={!!errors.work_type_name}
            helperText={errorMessages(errors.work_type_name?.message)}
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

WorkTypeForm.displayName = "WorkTypeForm";

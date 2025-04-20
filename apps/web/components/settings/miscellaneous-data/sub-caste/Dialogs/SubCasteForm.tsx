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
import { CastAutocomplete } from "../../../../common/Autocomplete/CastAutocomplete";
import { CompanyAutocomplete } from "../../../../common/Autocomplete/CompanyAutocomplete";

const SubCasteFormSchema = z.object({
  company_id: z
    .string()
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  caste_name: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  sub_caste_name: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  is_active: z.boolean().nullable().optional(),
});

export type SubCasteFormFieldValues = z.infer<typeof SubCasteFormSchema>;

export type SubCasteFormProps = {
  defaultValues?: Partial<SubCasteFormFieldValues>;
  loading?: boolean;
  disabled?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<SubCasteFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<SubCasteFormFieldValues>;
};

const formDefaultValues: SubCasteFormFieldValues = {
  company_id: null,
  caste_name: null,
  sub_caste_name: null,
  is_active: true,
};

export const SubCasteForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
    }: SubCasteFormProps,
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
      resolver: zodResolver(SubCasteFormSchema),
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
            error={!!errors.company_id}
            disabled={!!defaultValues.company_id || disabled}
            helperText={errorMessages(errors.company_id?.message)}
            name="company_id"
            required
          />

          <CastAutocomplete
            required
            name="caste_name"
            control={control}
            loading={loading}
            error={!!errors.caste_name}
            helperText={errorMessages(errors.caste_name?.message)}
            disabled={disabled}
          />
        </FormRow>

        <FormRow maxColumn={2}>
          <TextField
            control={control}
            label="Sub Caste Name"
            name="sub_caste_name"
            loading={loading}
            required
            error={!!errors.sub_caste_name}
            helperText={errorMessages(errors.sub_caste_name?.message)}
            disabled={disabled}
          />
        </FormRow>
      </Stack>
    );
  }
);

SubCasteForm.displayName = "DepartmentForm";

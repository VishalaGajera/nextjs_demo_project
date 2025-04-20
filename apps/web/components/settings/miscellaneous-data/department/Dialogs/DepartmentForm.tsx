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
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../hooks/useEnableDisableButton";
import {
  filterChangedFormFields,
  resetDependentFields,
} from "../../../../../utils/helper";
import { CompanyAutocomplete } from "../../../../common/Autocomplete/CompanyAutocomplete";
import { EmployeeAutocomplete } from "../../../../common/Autocomplete/EmployeeAutoComplete";

const DepartmentFormSchema = z.object({
  company_id: z
    .string()
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  department_code: z
    .string()
    .max(10, "common.maxCodeLength")
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  department_name: z
    .string()
    .max(255, "common.maxLength")
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  description: z.string().max(255, "common.maxLength").nullable(),
  is_active: z.boolean().nullable().optional(),
  department_heads: z.array(z.string()).optional().nullable(),
});

export type DepartmentFormFieldValues = z.infer<typeof DepartmentFormSchema>;

export type DepartmentFormProps = {
  defaultValues?: Partial<DepartmentFormFieldValues>;
  loading?: boolean;
  disabled?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<DepartmentFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<DepartmentFormFieldValues>;
};

const formDefaultValues: DepartmentFormFieldValues = {
  company_id: null,
  department_code: null,
  department_name: null,
  description: null,
  department_heads: null,
};

export const DepartmentForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
    }: DepartmentFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const initialValues = useMemo(() => {
      return { ...formDefaultValues, ...defaultValues };
    }, [defaultValues]);

    const methods = useForm({
      values: defaultValues,
      resolver: zodResolver(DepartmentFormSchema),
      mode: "all",
    });

    const {
      watch,
      control,
      setValue,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = methods;

    const companyId = watch("company_id");

    useEnableDisableButton({
      control,
      defaultValues: initialValues,
      errors,
    });

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

    const dependentFieldsMap: Partial<
      Record<
        keyof DepartmentFormFieldValues,
        (keyof DepartmentFormFieldValues)[]
      >
    > = {
      company_id: ["department_heads"],
    };

    useMemo(() => {
      resetDependentFields({
        fieldName: "company_id",
        fieldValue: companyId,
        dirtyFields,
        setValue,
        dependentFieldsMap,
      });
    }, [companyId]);

    return (
      <Stack gap="16px">
        <FormProvider {...methods}>
          <FormRow maxColumn={2}>
            <CompanyAutocomplete
              loading={loading}
              control={control}
              error={!!errors.company_id}
              helperText={errorMessages(errors.company_id?.message)}
              name="company_id"
              disabled={!!defaultValues.company_id || disabled}
              required
            />

            <TextField
              name="department_code"
              loading={loading}
              control={control}
              label="Department Code"
              required
              disabled={!!defaultValues.department_code || disabled}
              error={!!errors.department_code}
              helperText={errorMessages(errors.department_code?.message)}
            />
          </FormRow>

          <FormRow maxColumn={2}>
            <TextField
              control={control}
              name="department_name"
              loading={loading}
              label="Department Name"
              required
              error={!!errors.department_name}
              helperText={errorMessages(errors.department_name?.message)}
              disabled={disabled}
            />

            <TextField
              name="description"
              label="Description"
              control={control}
              loading={loading}
              error={!!errors.description}
              helperText={errorMessages(errors.description?.message)}
              disabled={disabled}
            />
          </FormRow>

          <EmployeeAutocomplete
            label="Department Authorised Person"
            name="department_heads"
            placeholder="Select Department Authorised Persons"
            isShowAvatar
            control={control}
            isShowSelectAll={false}
            loading={loading}
            multiple
            companyId={companyId ?? ""}
            error={!!errors.department_heads}
            helperText={errorMessages(errors.department_heads?.message)}
            disabled={!companyId || disabled}
          />
        </FormProvider>
      </Stack>
    );
  }
);

DepartmentForm.displayName = "DepartmentForm";

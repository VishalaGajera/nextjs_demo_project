import { FormRow, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { type ForwardedRef, forwardRef, useImperativeHandle } from "react";
import { useForm, type UseFormSetError } from "react-hook-form";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../hooks/useEnableDisableButton";
import { filterChangedFormFields } from "../../../../../utils/helper";
import { CompanyAutocomplete } from "../../../../common/Autocomplete/CompanyAutocomplete";
import { StructureByAutoComplete } from "../../../../common/Autocomplete/StructureByAutoComplete";
import { StructureTypeAutoComplete } from "../../../../common/Autocomplete/StructureTypeAutoComplete";

const SalaryStructureSchema = z.object({
  company_id: z
    .string()
    .nullable()
    .refine((value) => !!value, { message: "common.required" }),
  salary_structure_name: z
    .string()
    .nullable()
    .refine((value) => !!value, { message: "common.required" }),
  salary_intervals: z
    .array(z.enum(["monthly", "annually", "daily", "hourly"]))
    .min(1, { message: "common.selectionRequired" }),
  structure_types: z
    .array(z.enum(["range", "custom"]))
    .min(1, { message: "common.selectionRequired" }),
  description: z
    .string()
    .max(255, {
      message: "common.maxLength",
    })
    .nullable(),
});

export type SalaryStructureType = z.infer<typeof SalaryStructureSchema>;

const initialValues = {
  company_id: null,
  salary_structure_name: null,
  salary_intervals: [],
  structure_types: [],
  description: null,
};

export type SalaryStructureFormProps = {
  defaultValues?: SalaryStructureType;
  loading?: boolean;
  formType?: "add" | "update" | "view";
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<SalaryStructureType>) => void
  ) => void;
  setError: UseFormSetError<SalaryStructureType>;
};

export const SalaryStructureForm = forwardRef(
  (
    {
      defaultValues = initialValues,
      loading = false,
      formType = "add",
    }: SalaryStructureFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      control,
      handleSubmit,
      setError,
      watch,
      formState: { errors, dirtyFields },
    } = useForm<SalaryStructureType>({
      values: defaultValues,
      resolver: zodResolver(SalaryStructureSchema),
      mode: "all",
    });

    const errorMessage = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(formValues, {
            ...dirtyFields,
          });

          onSubmit(filterFormValues);
        })();
      },
      setError,
    }));

    const isEditMode = formType === "update";

    const isViewMode = formType === "view";

    const isCompanySelected = watch("company_id");

    return (
      <Stack gap="16px">
        <FormRow maxColumn={2}>
          <CompanyAutocomplete
            required
            loading={loading}
            disabled={isEditMode || isViewMode}
            control={control}
            name="company_id"
            error={!!errors.company_id?.message}
            helperText={errorMessage(errors.company_id?.message)}
          />

          <TextField
            control={control}
            loading={loading}
            required
            disabled={isViewMode}
            label="Salary Structure Name"
            name="salary_structure_name"
            error={!!errors.salary_structure_name?.message}
            helperText={errorMessage(errors.salary_structure_name?.message)}
            placeholder="Enter Structure Name"
          />
        </FormRow>

        <FormRow maxColumn={2}>
          <StructureByAutoComplete
            multiple
            error={!!errors.salary_intervals?.message}
            helperText={errorMessage(errors.salary_intervals?.message)}
            control={control}
            loading={loading}
            disabled={isEditMode || isViewMode || !isCompanySelected}
            name="salary_intervals"
            required
          />

          <StructureTypeAutoComplete
            multiple
            control={control}
            loading={loading}
            error={!!errors.structure_types?.message}
            helperText={errorMessage(errors.structure_types?.message)}
            name="structure_types"
            disabled={isEditMode || isViewMode || !isCompanySelected}
            required
          />
        </FormRow>

        <TextField
          control={control}
          fullWidth
          label="Description"
          loading={loading}
          multiline
          disabled={isViewMode}
          name="description"
          error={!!errors.description?.message}
          helperText={errorMessage(errors.description?.message)}
          placeholder="Enter Description"
        />
      </Stack>
    );
  }
);

SalaryStructureForm.displayName = "SalaryStructureForm";

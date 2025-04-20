import { DatePicker, FormRow, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../hooks/useEnableDisableButton";
import { filterChangedFormFields } from "../../../../../../utils/helper";
import { HolidaySchemeAutocomplete } from "../../../../../common/Autocomplete/HolidaySchemeAutocomplete";

const HolidayAllocationFormSchema = z.object({
  employee_id: z.array(z.string()).nullable(),
  holiday_group_id: z
    .string()
    .nullable()
    .refine((value) => !!value, { message: "common.required" }),
  effective_from: z
    .string()
    .nullable()
    .refine((value) => !!value, { message: "common.required" }),
  remark: z.string().nullable(),
});

export type HolidayAllocationFormValues = z.infer<
  typeof HolidayAllocationFormSchema
>;

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<HolidayAllocationFormValues>) => void
  ) => void;
  setError: UseFormSetError<HolidayAllocationFormValues>;
};

type HolidayAllocationFormProps = {
  defaultValues?: HolidayAllocationFormValues;
  loading?: boolean;
  employeeIds?: string[];
  companyId: string;
};

const formDefaultValues: HolidayAllocationFormValues = {
  employee_id: null,
  holiday_group_id: null,
  effective_from: null,
  remark: null,
};

export const HolidayAllocationForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      employeeIds,
      companyId,
    }: HolidayAllocationFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const initialValues = useMemo(() => {
      return {
        ...defaultValues,
        employee_id: employeeIds || null,
      };
    }, [employeeIds]);

    const {
      control,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm<HolidayAllocationFormValues>({
      defaultValues: initialValues,
      resolver: zodResolver(HolidayAllocationFormSchema),
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
          const filterFormValues = filterChangedFormFields(
            formValues,
            dirtyFields
          );

          onSubmit({
            ...filterFormValues,
            employee_id: employeeIds,
          });
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    return (
      <Stack gap="20px">
        <FormRow maxColumn={2}>
          <HolidaySchemeAutocomplete
            name="holiday_group_id"
            control={control}
            loading={loading}
            companyId={companyId}
            required
            error={!!errors.holiday_group_id}
            helperText={errorMessages(errors.holiday_group_id?.message)}
          />
          <DatePicker
            name="effective_from"
            control={control}
            loading={loading}
            label="Effective From"
            required
            error={!!errors.effective_from}
            helperText={errorMessages(errors.effective_from?.message)}
          />
        </FormRow>

        <TextField
          control={control}
          label="Remark"
          name="remark"
          fullWidth
          multiline
          loading={loading}
        />
      </Stack>
    );
  }
);

HolidayAllocationForm.displayName = "HolidayAllocationForm";

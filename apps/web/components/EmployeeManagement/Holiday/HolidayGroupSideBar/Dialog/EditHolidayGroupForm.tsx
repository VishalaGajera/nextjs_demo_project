import { FormRow, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../hooks/useEnableDisableButton";
import { filterChangedFormFields } from "../../../../../utils/helper";

const EditHolidayGroupFormSchema = z.object({
  holiday_group_name: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type EditHolidayGroupFormFieldValues = z.infer<
  typeof EditHolidayGroupFormSchema
>;

type EditHolidayGroupFormProps = {
  defaultValues?: EditHolidayGroupFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<EditHolidayGroupFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<EditHolidayGroupFormFieldValues>;
};

const formDefaultValues: EditHolidayGroupFormFieldValues = {
  holiday_group_name: null,
};

export const EditHolidayGroupForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: EditHolidayGroupFormProps,
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
      resolver: zodResolver(EditHolidayGroupFormSchema),
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
      <FormRow maxColumn={1}>
        <TextField
          name="holiday_group_name"
          control={control}
          loading={loading}
          label="Holiday Group"
          required
          error={!!errors.holiday_group_name}
          helperText={errorMessages(errors.holiday_group_name?.message)}
          placeholder="Enter Holiday Group Name"
        />
      </FormRow>
    );
  }
);

EditHolidayGroupForm.displayName = "EditHolidayGroupForm";

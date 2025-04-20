import { zodResolver } from "@hookform/resolvers/zod";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { ShiftSchemeAutocomplete } from "../../../../common/Autocomplete/ShiftSchemeAutocomplete";
import type { ShiftPlannerEditFields } from "../ShiftPlannerList/ShiftPlannerList";

const ShiftPlannerFormSchema = z.object({
  shift_type_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type ShiftPlannerFormFieldValues = z.infer<
  typeof ShiftPlannerFormSchema
>;

type ShiftPlannerFormProps = {
  defaultValues?: ShiftPlannerFormFieldValues;
  loading?: boolean;
  companyId: string;
  shiftPlannerData: ShiftPlannerEditFields;
};
export type SlotsType = {
  employee_ids: string[];
  effective_from: string;
  effective_to: string;
};
export type FormRef = {
  submitForm: (
    onSubmit: (
      formValues: Partial<ShiftPlannerFormFieldValues> & { slots: SlotsType[] }
    ) => void
  ) => void;
  setError: UseFormSetError<ShiftPlannerFormFieldValues>;
};

const formDefaultValues: ShiftPlannerFormFieldValues = {
  shift_type_id: null,
};

export const ShiftPlannerForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      companyId,
      shiftPlannerData,
    }: ShiftPlannerFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const {
      control,
      setError,
      formState: { errors },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(ShiftPlannerFormSchema),
      mode: "all",
    });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const slots: SlotsType[] = [{ ...shiftPlannerData }];

          onSubmit({
            ...formValues,
            slots,
          });
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    return (
      <ShiftSchemeAutocomplete
        name="shift_type_id"
        required
        error={!!errors.shift_type_id}
        loading={loading}
        control={control}
        companyId={companyId}
        helperText={errorMessages(errors.shift_type_id?.message)}
      />
    );
  }
);

ShiftPlannerForm.displayName = "ShiftPlannerForm";

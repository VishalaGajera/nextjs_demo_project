import {
  DatePicker,
  FormContainer,
  FormRow,
  FormSection,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../../../../../../hooks/useEnableDisableButton";
import { filterNestedChangedFormFields } from "../../../../../../../../../../../utils/helper";
import { BusinessUnitAutocomplete } from "../../../../../../../../../../common/Autocomplete/BusinessUnitAutocomplete";
import { LocationAutocomplete } from "../../../../../../../../../../common/Autocomplete/LocationAutocomplete";
import { CORRECTION_OF_DATA } from "./hooks/constant";
import type { OptionKey } from "./hooks/useTabOptions";
import { ActionTypeSchema } from "./hooks/useTabOptions";

const BusinessUnitSchema = z.object({
  id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  effective_from: z.string().nullable(),
  remark: z.string().max(255, "common.maxLength").nullable(),
});

const BusinessUnitWithLocationSchema = z
  .object({
    business_unit: BusinessUnitSchema,
    business_unit_location: BusinessUnitSchema,
    operationType: ActionTypeSchema,
  })
  .superRefine((value, ctx) => {
    if (
      value.operationType !== CORRECTION_OF_DATA &&
      !value.business_unit.effective_from
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["business_unit.effective_from"],
        message: "common.required",
      });
    }
  });

export type BusinessUnitFormFieldValues = z.infer<
  typeof BusinessUnitWithLocationSchema
>;

export type BusinessUnitFormProps = {
  defaultValues?: BusinessUnitFormFieldValues & {
    joining_date: string;
  };
  companyId?: string;
  loading: boolean;
  operationType: OptionKey;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<BusinessUnitFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<BusinessUnitFormFieldValues>;
};

const formDefaultValues: BusinessUnitFormFieldValues = {
  business_unit: {
    id: null,
    effective_from: null,
    remark: null,
  },
  business_unit_location: {
    id: null,
    effective_from: null,
    remark: null,
  },
  operationType: CORRECTION_OF_DATA,
};

export const BusinessUnitForm = forwardRef(
  (
    { defaultValues, companyId, loading, operationType }: BusinessUnitFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const initialValues = useMemo(() => {
      return { ...formDefaultValues, ...defaultValues };
    }, [defaultValues]);

    const {
      control,
      setError,
      clearErrors,
      formState: { errors, dirtyFields },
      handleSubmit,
      watch,
      setValue,
      trigger,
    } = useForm({
      values: initialValues,
      resolver: zodResolver(BusinessUnitWithLocationSchema),
      mode: "all",
    });

    useEnableDisableButton({
      control,
      defaultValues: initialValues,
      errors,
    });

    useMemo(() => {
      setValue("operationType", operationType);

      if (operationType === CORRECTION_OF_DATA && defaultValues) {
        setValue(
          "business_unit.effective_from",
          defaultValues.business_unit.effective_from,
          {
            shouldDirty: true,
          }
        );
      }

      clearErrors();
    }, [operationType]);

    const businessUnitId = watch("business_unit.id");

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues =
            operationType === CORRECTION_OF_DATA
              ? filterNestedChangedFormFields(formValues, dirtyFields)
              : { ...formValues };

          onSubmit(filterFormValues);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    useEffect(() => {
      if (dirtyFields?.business_unit?.id) {
        setValue("business_unit_location.id", null);
        trigger("business_unit_location.id");
      }
    }, [businessUnitId]);

    return (
      <FormContainer>
        <FormSection>
          <FormRow maxColumn={2}>
            <BusinessUnitAutocomplete
              required={true}
              name="business_unit.id"
              control={control}
              loading={loading}
              companyId={companyId}
              error={!!errors.business_unit?.id}
              helperText={errorMessages(errors.business_unit?.id?.message)}
            />
            <LocationAutocomplete
              required={true}
              name="business_unit_location.id"
              control={control}
              loading={loading}
              businessUnitId={businessUnitId}
              error={!!errors.business_unit_location?.id}
              helperText={errorMessages(
                errors.business_unit_location?.id?.message
              )}
            />
          </FormRow>

          <FormRow maxColumn={2}>
            {operationType !== CORRECTION_OF_DATA && (
              <DatePicker
                name="business_unit.effective_from"
                control={control}
                label="Effective From"
                setError={setError}
                minDate={
                  defaultValues?.joining_date
                    ? DateTime.fromISO(defaultValues?.joining_date)
                    : undefined
                }
                loading={loading}
                required
                maxDate={DateTime.now()}
                error={!!errors.business_unit?.effective_from}
                helperText={errorMessages(
                  errors.business_unit?.effective_from?.message
                )}
              />
            )}
            <TextField
              name="business_unit.remark"
              control={control}
              label="Remark"
              loading={loading}
              error={!!errors.business_unit?.remark}
              helperText={errorMessages(errors.business_unit?.remark?.message)}
            />
          </FormRow>
        </FormSection>
      </FormContainer>
    );
  }
);
BusinessUnitForm.displayName = "BusinessUnitForm";

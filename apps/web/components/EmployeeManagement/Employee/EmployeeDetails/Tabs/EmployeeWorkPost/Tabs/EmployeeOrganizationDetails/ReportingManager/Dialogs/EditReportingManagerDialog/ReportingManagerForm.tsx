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
import { forwardRef, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../../../../../../hooks/useEnableDisableButton";
import { filterChangedFormFields } from "../../../../../../../../../../../utils/helper";
import { ReportingManagerAutoComplete } from "../../../../../../../../../../common/Autocomplete/ReportingManagerAutoComplete";
import { CORRECTION_OF_DATA } from "../../../BusinessUnit/Dialogs/EditBusinessUnitDialog/hooks/constant";
import type { OptionKey } from "../../../BusinessUnit/Dialogs/EditBusinessUnitDialog/hooks/useTabOptions";
import { ActionTypeSchema } from "../../../BusinessUnit/Dialogs/EditBusinessUnitDialog/hooks/useTabOptions";

const ReportingManagerSchema = z
  .object({
    id: z
      .string()
      .nullable()
      .optional()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    effective_from: z.string().nullable(),
    operationType: ActionTypeSchema,
    remark: z.string().max(255, "common.maxLength").nullable().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.operationType !== CORRECTION_OF_DATA && !value.effective_from) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["effective_from"],
        message: "common.required",
      });
    }
  });

export type ReportingManagerFormFieldValues = z.infer<
  typeof ReportingManagerSchema
>;
export type ReportingManagerFormProps = {
  defaultValues?: ReportingManagerFormFieldValues & {
    joining_date: string;
  };
  companyId: string;
  loading: boolean;
  operationType: OptionKey;
};
export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<ReportingManagerFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<ReportingManagerFormFieldValues>;
};

const formDefaultValues: ReportingManagerFormFieldValues = {
  id: null,
  effective_from: null,
  remark: null,
  operationType: CORRECTION_OF_DATA,
};

export const ReportingManagerForm = forwardRef(
  (
    {
      defaultValues,
      companyId,
      operationType,
      loading,
    }: ReportingManagerFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const initialValues = useMemo(() => {
      return {
        ...formDefaultValues,
        ...defaultValues,
        effective_from: defaultValues?.effective_from
          ? defaultValues?.effective_from
          : (defaultValues?.joining_date ?? null),
      };
    }, [defaultValues]);

    const {
      control,
      setError,
      setValue,
      clearErrors,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: initialValues,
      resolver: zodResolver(ReportingManagerSchema),
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
        setValue("effective_from", defaultValues.effective_from, {
          shouldDirty: true,
        });
      }

      clearErrors();
    }, [operationType]);

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues =
            operationType === CORRECTION_OF_DATA
              ? filterChangedFormFields(formValues, dirtyFields)
              : { ...formValues };

          const { id, ...rest } = filterFormValues;

          const updatedFormValues =
            id === "no-reporting-manager"
              ? { ...rest, id: null }
              : filterFormValues;

          onSubmit(updatedFormValues);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    return (
      <FormContainer>
        <FormSection>
          <FormRow maxColumn={2}>
            <ReportingManagerAutoComplete
              required={true}
              name="id"
              control={control}
              loading={loading}
              companyId={companyId}
              error={!!errors.id}
              helperText={errorMessages(errors.id?.message)}
            />

            <TextField
              name="remark"
              control={control}
              label="Remark"
              loading={loading}
              error={!!errors.remark}
              helperText={errorMessages(errors.remark?.message)}
            />
          </FormRow>

          <FormRow maxColumn={2}>
            {operationType !== CORRECTION_OF_DATA && (
              <DatePicker
                name="effective_from"
                control={control}
                loading={loading}
                required
                label="Effective From"
                setError={setError}
                minDate={
                  defaultValues?.joining_date
                    ? DateTime.fromISO(defaultValues?.joining_date)
                    : undefined
                }
                maxDate={DateTime.now()}
                error={!!errors.effective_from}
                helperText={errorMessages(errors.effective_from?.message)}
              />
            )}
          </FormRow>
        </FormSection>
      </FormContainer>
    );
  }
);
ReportingManagerForm.displayName = "ReportingManagerForm";

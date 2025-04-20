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
import { SkillTypeAutocomplete } from "../../../../../../../../../../common/Autocomplete/SkillTypeAutocomplete";
import { CORRECTION_OF_DATA } from "../../../../EmployeeOrganizationDetails/BusinessUnit/Dialogs/EditBusinessUnitDialog/hooks/constant";
import {
  ActionTypeSchema,
  type OptionKey,
} from "../../../../EmployeeOrganizationDetails/BusinessUnit/Dialogs/EditBusinessUnitDialog/hooks/useTabOptions";

const SkillTypeSchema = z
  .object({
    id: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    effective_from: z.string().nullable(),
    operationType: ActionTypeSchema,
    remark: z.string().max(255, "common.maxLength").nullable(),
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

export type EditSkillTypeFormFieldValues = z.infer<typeof SkillTypeSchema>;
export type EditSkillTypeFormProps = {
  defaultValues?: EditSkillTypeFormFieldValues & {
    joining_date: string;
  };
  companyId: string;
  loading: boolean;
  operationType: OptionKey;
};
export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<EditSkillTypeFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<EditSkillTypeFormFieldValues>;
};

const formDefaultValues: EditSkillTypeFormFieldValues = {
  id: null,
  remark: null,
  effective_from: null,
  operationType: CORRECTION_OF_DATA,
};

export const EditSkillTypeForm = forwardRef(
  (
    {
      defaultValues,
      loading,
      companyId,
      operationType,
    }: EditSkillTypeFormProps,
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
      resolver: zodResolver(SkillTypeSchema),
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

          onSubmit(filterFormValues);
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
            <SkillTypeAutocomplete
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

          <FormRow maxColumn={1}>
            {operationType !== CORRECTION_OF_DATA && (
              <DatePicker
                name="effective_from"
                control={control}
                label="Effective From"
                setError={setError}
                loading={loading}
                required
                error={!!errors.effective_from}
                helperText={errorMessages(errors.effective_from?.message)}
                minDate={
                  defaultValues?.joining_date
                    ? DateTime.fromISO(defaultValues?.joining_date)
                    : undefined
                }
                maxDate={DateTime.now()}
              />
            )}
          </FormRow>
        </FormSection>
      </FormContainer>
    );
  }
);
EditSkillTypeForm.displayName = "EditSkillTypeForm";

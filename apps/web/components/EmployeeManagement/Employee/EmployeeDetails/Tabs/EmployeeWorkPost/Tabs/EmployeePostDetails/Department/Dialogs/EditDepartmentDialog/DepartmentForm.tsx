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
import { DepartmentAutocomplete } from "../../../../../../../../../../common/Autocomplete/DepartmentAutocomplete";
import { SubDepartmentAutocomplete } from "../../../../../../../../../../common/Autocomplete/SubDepartmentAutocomplete";
import { CORRECTION_OF_DATA } from "../../../../EmployeeOrganizationDetails/BusinessUnit/Dialogs/EditBusinessUnitDialog/hooks/constant";
import type { OptionKey } from "../../../../EmployeeOrganizationDetails/BusinessUnit/Dialogs/EditBusinessUnitDialog/hooks/useTabOptions";
import { ActionTypeSchema } from "../../../../EmployeeOrganizationDetails/BusinessUnit/Dialogs/EditBusinessUnitDialog/hooks/useTabOptions";

const DepartmentSchema = z.object({
  id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  effective_from: z.string().nullable(),
  remark: z.string().max(255, "common.maxLength").nullable(),
});

const DepartmentWithSubDepartmentSchema = z
  .object({
    department: DepartmentSchema,
    sub_department: DepartmentSchema,
    operationType: ActionTypeSchema,
  })
  .superRefine((value, ctx) => {
    if (
      value.operationType !== CORRECTION_OF_DATA &&
      !value.department.effective_from
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["department.effective_from"],
        message: "common.required",
      });
    }
  });

export type DepartmentFormFieldValues = z.infer<
  typeof DepartmentWithSubDepartmentSchema
>;
export type DepartmentFormProps = {
  defaultValues?: DepartmentFormFieldValues & {
    joining_date: string;
  };
  companyId?: string;
  loading: boolean;
  operationType: OptionKey;
};
export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<DepartmentFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<DepartmentFormFieldValues>;
};

const formDefaultValues: DepartmentFormFieldValues = {
  department: {
    id: null,
    effective_from: null,
    remark: null,
  },
  sub_department: {
    id: null,
    effective_from: null,
    remark: null,
  },
  operationType: CORRECTION_OF_DATA,
};

export const DepartmentForm = forwardRef(
  (
    { defaultValues, loading, companyId, operationType }: DepartmentFormProps,
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
      resolver: zodResolver(DepartmentWithSubDepartmentSchema),
      mode: "all",
    });

    useEnableDisableButton({
      control,
      defaultValues: initialValues,
      errors,
    });

    const departmentId = watch("department.id");

    useMemo(() => {
      setValue("operationType", operationType);

      if (operationType === CORRECTION_OF_DATA && defaultValues) {
        setValue(
          "department.effective_from",
          defaultValues.department.effective_from,
          {
            shouldDirty: true,
          }
        );
      }

      clearErrors();
    }, [operationType]);

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
      if (dirtyFields.department?.id) {
        setValue("sub_department.id", null);
        trigger("sub_department.id");
      }
    }, [departmentId]);

    return (
      <FormContainer>
        <FormSection>
          <FormRow maxColumn={2}>
            <DepartmentAutocomplete
              required={true}
              name="department.id"
              control={control}
              loading={loading}
              companyId={companyId}
              error={!!errors.department?.id}
              helperText={errorMessages(errors.department?.id?.message)}
            />
            <SubDepartmentAutocomplete
              required={true}
              name="sub_department.id"
              control={control}
              loading={loading}
              departmentId={departmentId}
              error={!!errors.sub_department?.id}
              helperText={errorMessages(errors.sub_department?.id?.message)}
            />
          </FormRow>

          <FormRow maxColumn={2}>
            {operationType !== CORRECTION_OF_DATA && (
              <DatePicker
                name="department.effective_from"
                control={control}
                label="Effective From"
                loading={loading}
                setError={setError}
                required
                error={!!errors.department?.effective_from}
                minDate={
                  defaultValues?.joining_date
                    ? DateTime.fromISO(defaultValues?.joining_date)
                    : undefined
                }
                maxDate={DateTime.now()}
                helperText={errorMessages(
                  errors.department?.effective_from?.message
                )}
              />
            )}

            <TextField
              name="department.remark"
              control={control}
              label="Remark"
              loading={loading}
              error={!!errors.department?.remark}
              helperText={errorMessages(errors.department?.remark?.message)}
            />
          </FormRow>
        </FormSection>
      </FormContainer>
    );
  }
);
DepartmentForm.displayName = "DepartmentForm";
